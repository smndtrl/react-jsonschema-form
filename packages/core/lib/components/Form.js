import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component, createRef } from 'react';
import { createSchemaUtils, deepEquals, getTemplate, getUiOptions, isObject, mergeObjects, NAME_KEY, RJSF_ADDITIONAL_PROPERTIES_FLAG, shouldRender, SUBMIT_BTN_OPTIONS_KEY, toErrorList, UI_GLOBAL_OPTIONS_KEY, UI_OPTIONS_KEY, validationDataMerge, } from '@rjsf/utils';
import _forEach from 'lodash/forEach';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import _pick from 'lodash/pick';
import _toPath from 'lodash/toPath';
import getDefaultRegistry from '../getDefaultRegistry';
/** The `Form` component renders the outer form and all the fields defined in the `schema` */
export default class Form extends Component {
    /** Constructs the `Form` from the `props`. Will setup the initial state from the props. It will also call the
     * `onChange` handler if the initially provided `formData` is modified to add missing default values as part of the
     * state construction.
     *
     * @param props - The initial props for the `Form`
     */
    constructor(props) {
        super(props);
        /** Returns the `formData` with only the elements specified in the `fields` list
         *
         * @param formData - The data for the `Form`
         * @param fields - The fields to keep while filtering
         */
        this.getUsedFormData = (formData, fields) => {
            // For the case of a single input form
            if (fields.length === 0 && typeof formData !== 'object') {
                return formData;
            }
            // _pick has incorrect type definition, it works with string[][], because lodash/hasIn supports it
            const data = _pick(formData, fields);
            if (Array.isArray(formData)) {
                return Object.keys(data).map((key) => data[key]);
            }
            return data;
        };
        /** Returns the list of field names from inspecting the `pathSchema` as well as using the `formData`
         *
         * @param pathSchema - The `PathSchema` object for the form
         * @param [formData] - The form data to use while checking for empty objects/arrays
         */
        this.getFieldNames = (pathSchema, formData) => {
            const getAllPaths = (_obj, acc = [], paths = [[]]) => {
                Object.keys(_obj).forEach((key) => {
                    if (typeof _obj[key] === 'object') {
                        const newPaths = paths.map((path) => [...path, key]);
                        // If an object is marked with additionalProperties, all its keys are valid
                        if (_obj[key][RJSF_ADDITIONAL_PROPERTIES_FLAG] && _obj[key][NAME_KEY] !== '') {
                            acc.push(_obj[key][NAME_KEY]);
                        }
                        else {
                            getAllPaths(_obj[key], acc, newPaths);
                        }
                    }
                    else if (key === NAME_KEY && _obj[key] !== '') {
                        paths.forEach((path) => {
                            const formValue = _get(formData, path);
                            // adds path to fieldNames if it points to a value
                            // or an empty object/array
                            if (typeof formValue !== 'object' ||
                                _isEmpty(formValue) ||
                                (Array.isArray(formValue) && formValue.every((val) => typeof val !== 'object'))) {
                                acc.push(path);
                            }
                        });
                    }
                });
                return acc;
            };
            return getAllPaths(pathSchema);
        };
        /** Returns the `formData` after filtering to remove any extra data not in a form field
         *
         * @param formData - The data for the `Form`
         * @returns The `formData` after omitting extra data
         */
        this.omitExtraData = (formData) => {
            const { schema, schemaUtils } = this.state;
            const retrievedSchema = schemaUtils.retrieveSchema(schema, formData);
            const pathSchema = schemaUtils.toPathSchema(retrievedSchema, '', formData);
            const fieldNames = this.getFieldNames(pathSchema, formData);
            const newFormData = this.getUsedFormData(formData, fieldNames);
            return newFormData;
        };
        /** Function to handle changes made to a field in the `Form`. This handler receives an entirely new copy of the
         * `formData` along with a new `ErrorSchema`. It will first update the `formData` with any missing default fields and
         * then, if `omitExtraData` and `liveOmit` are turned on, the `formData` will be filtered to remove any extra data not
         * in a form field. Then, the resulting formData will be validated if required. The state will be updated with the new
         * updated (potentially filtered) `formData`, any errors that resulted from validation. Finally the `onChange`
         * callback will be called if specified with the updated state.
         *
         * @param formData - The new form data from a change to a field
         * @param newErrorSchema - The new `ErrorSchema` based on the field change
         * @param id - The id of the field that caused the change
         */
        this.onChange = (formData, newErrorSchema, id) => {
            const { extraErrors, omitExtraData, liveOmit, noValidate, liveValidate, onChange } = this.props;
            const { schemaUtils, schema, retrievedSchema } = this.state;
            if (isObject(formData) || Array.isArray(formData)) {
                const newState = this.getStateFromProps(this.props, formData, retrievedSchema);
                formData = newState.formData;
            }
            const mustValidate = !noValidate && liveValidate;
            let state = { formData, schema };
            let newFormData = formData;
            let _retrievedSchema;
            if (omitExtraData === true && liveOmit === true) {
                newFormData = this.omitExtraData(formData);
                state = {
                    formData: newFormData,
                };
            }
            if (mustValidate) {
                const schemaValidation = this.validate(newFormData, schema, schemaUtils, retrievedSchema);
                let errors = schemaValidation.errors;
                let errorSchema = schemaValidation.errorSchema;
                const schemaValidationErrors = errors;
                const schemaValidationErrorSchema = errorSchema;
                if (extraErrors) {
                    const merged = validationDataMerge(schemaValidation, extraErrors);
                    errorSchema = merged.errorSchema;
                    errors = merged.errors;
                }
                // Merging 'newErrorSchema' into 'errorSchema' to display the custom raised errors.
                if (newErrorSchema) {
                    const filteredErrors = this.filterErrorsBasedOnSchema(newErrorSchema, retrievedSchema, newFormData);
                    errorSchema = mergeObjects(errorSchema, filteredErrors, 'preventDuplicates');
                }
                state = {
                    formData: newFormData,
                    errors,
                    errorSchema,
                    schemaValidationErrors,
                    schemaValidationErrorSchema,
                };
            }
            else if (!noValidate && newErrorSchema) {
                const errorSchema = extraErrors
                    ? mergeObjects(newErrorSchema, extraErrors, 'preventDuplicates')
                    : newErrorSchema;
                state = {
                    formData: newFormData,
                    errorSchema: errorSchema,
                    errors: toErrorList(errorSchema),
                };
            }
            if (_retrievedSchema) {
                state.retrievedSchema = _retrievedSchema;
            }
            this.setState(state, () => onChange && onChange({ ...this.state, ...state }, id));
        };
        /**
         * Callback function to handle reset form data.
         * - Reset all fields with default values.
         * - Reset validations and errors
         *
         */
        this.reset = () => {
            const { onChange } = this.props;
            const newState = this.getStateFromProps(this.props, undefined);
            const newFormData = newState.formData;
            const state = {
                formData: newFormData,
                errorSchema: {},
                errors: [],
                schemaValidationErrors: [],
                schemaValidationErrorSchema: {},
            };
            this.setState(state, () => onChange && onChange({ ...this.state, ...state }));
        };
        /** Callback function to handle when a field on the form is blurred. Calls the `onBlur` callback for the `Form` if it
         * was provided.
         *
         * @param id - The unique `id` of the field that was blurred
         * @param data - The data associated with the field that was blurred
         */
        this.onBlur = (id, data) => {
            const { onBlur } = this.props;
            if (onBlur) {
                onBlur(id, data);
            }
        };
        /** Callback function to handle when a field on the form is focused. Calls the `onFocus` callback for the `Form` if it
         * was provided.
         *
         * @param id - The unique `id` of the field that was focused
         * @param data - The data associated with the field that was focused
         */
        this.onFocus = (id, data) => {
            const { onFocus } = this.props;
            if (onFocus) {
                onFocus(id, data);
            }
        };
        /** Callback function to handle when the form is submitted. First, it prevents the default event behavior. Nothing
         * happens if the target and currentTarget of the event are not the same. It will omit any extra data in the
         * `formData` in the state if `omitExtraData` is true. It will validate the resulting `formData`, reporting errors
         * via the `onError()` callback unless validation is disabled. Finally, it will add in any `extraErrors` and then call
         * back the `onSubmit` callback if it was provided.
         *
         * @param event - The submit HTML form event
         */
        this.onSubmit = (event) => {
            event.preventDefault();
            if (event.target !== event.currentTarget) {
                return;
            }
            event.persist();
            const { omitExtraData, extraErrors, noValidate, onSubmit } = this.props;
            let { formData: newFormData } = this.state;
            if (omitExtraData === true) {
                newFormData = this.omitExtraData(newFormData);
            }
            if (noValidate || this.validateFormWithFormData(newFormData)) {
                // There are no errors generated through schema validation.
                // Check for user provided errors and update state accordingly.
                const errorSchema = extraErrors || {};
                const errors = extraErrors ? toErrorList(extraErrors) : [];
                this.setState({
                    formData: newFormData,
                    errors,
                    errorSchema,
                    schemaValidationErrors: [],
                    schemaValidationErrorSchema: {},
                }, () => {
                    if (onSubmit) {
                        onSubmit({ ...this.state, formData: newFormData, status: 'submitted' }, event);
                    }
                });
            }
        };
        /** Provides a function that can be used to programmatically submit the `Form` */
        this.submit = () => {
            if (this.formElement.current) {
                const submitCustomEvent = new CustomEvent('submit', {
                    cancelable: true,
                });
                submitCustomEvent.preventDefault();
                this.formElement.current.dispatchEvent(submitCustomEvent);
                this.formElement.current.requestSubmit();
            }
        };
        /** Validates the form using the given `formData`. For use on form submission or on programmatic validation.
         * If `onError` is provided, then it will be called with the list of errors.
         *
         * @param formData - The form data to validate
         * @returns - True if the form is valid, false otherwise.
         */
        this.validateFormWithFormData = (formData) => {
            const { extraErrors, extraErrorsBlockSubmit, focusOnFirstError, onError } = this.props;
            const { errors: prevErrors } = this.state;
            const schemaValidation = this.validate(formData);
            let errors = schemaValidation.errors;
            let errorSchema = schemaValidation.errorSchema;
            const schemaValidationErrors = errors;
            const schemaValidationErrorSchema = errorSchema;
            const hasError = errors.length > 0 || (extraErrors && extraErrorsBlockSubmit);
            if (hasError) {
                if (extraErrors) {
                    const merged = validationDataMerge(schemaValidation, extraErrors);
                    errorSchema = merged.errorSchema;
                    errors = merged.errors;
                }
                if (focusOnFirstError) {
                    if (typeof focusOnFirstError === 'function') {
                        focusOnFirstError(errors[0]);
                    }
                    else {
                        this.focusOnError(errors[0]);
                    }
                }
                this.setState({
                    errors,
                    errorSchema,
                    schemaValidationErrors,
                    schemaValidationErrorSchema,
                }, () => {
                    if (onError) {
                        onError(errors);
                    }
                    else {
                        console.error('Form validation failed', errors);
                    }
                });
            }
            else if (prevErrors.length > 0) {
                this.setState({
                    errors: [],
                    errorSchema: {},
                    schemaValidationErrors: [],
                    schemaValidationErrorSchema: {},
                });
            }
            return !hasError;
        };
        if (!props.validator) {
            throw new Error('A validator is required for Form functionality to work');
        }
        this.state = this.getStateFromProps(props, props.formData);
        if (this.props.onChange && !deepEquals(this.state.formData, this.props.formData)) {
            this.props.onChange(this.state);
        }
        this.formElement = createRef();
    }
    /**
     * `getSnapshotBeforeUpdate` is a React lifecycle method that is invoked right before the most recently rendered
     * output is committed to the DOM. It enables your component to capture current values (e.g., scroll position) before
     * they are potentially changed.
     *
     * In this case, it checks if the props have changed since the last render. If they have, it computes the next state
     * of the component using `getStateFromProps` method and returns it along with a `shouldUpdate` flag set to `true` IF
     * the `nextState` and `prevState` are different, otherwise `false`. This ensures that we have the most up-to-date
     * state ready to be applied in `componentDidUpdate`.
     *
     * If `formData` hasn't changed, it simply returns an object with `shouldUpdate` set to `false`, indicating that a
     * state update is not necessary.
     *
     * @param prevProps - The previous set of props before the update.
     * @param prevState - The previous state before the update.
     * @returns Either an object containing the next state and a flag indicating that an update should occur, or an object
     *        with a flag indicating that an update is not necessary.
     */
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (!deepEquals(this.props, prevProps)) {
            const isSchemaChanged = !deepEquals(prevProps.schema, this.props.schema);
            const isFormDataChanged = !deepEquals(prevProps.formData, this.props.formData);
            const nextState = this.getStateFromProps(this.props, this.props.formData, 
            // If the `schema` has changed, we need to update the retrieved schema.
            // Or if the `formData` changes, for example in the case of a schema with dependencies that need to
            //  match one of the subSchemas, the retrieved schema must be updated.
            isSchemaChanged || isFormDataChanged ? undefined : this.state.retrievedSchema, isSchemaChanged);
            const shouldUpdate = !deepEquals(nextState, prevState);
            return { nextState, shouldUpdate };
        }
        return { shouldUpdate: false };
    }
    /**
     * `componentDidUpdate` is a React lifecycle method that is invoked immediately after updating occurs. This method is
     * not called for the initial render.
     *
     * Here, it checks if an update is necessary based on the `shouldUpdate` flag received from `getSnapshotBeforeUpdate`.
     * If an update is required, it applies the next state and, if needed, triggers the `onChange` handler to inform about
     * changes.
     *
     * This method effectively replaces the deprecated `UNSAFE_componentWillReceiveProps`, providing a safer alternative
     * to handle prop changes and state updates.
     *
     * @param _ - The previous set of props.
     * @param prevState - The previous state of the component before the update.
     * @param snapshot - The value returned from `getSnapshotBeforeUpdate`.
     */
    componentDidUpdate(_, prevState, snapshot) {
        if (snapshot.shouldUpdate) {
            const { nextState } = snapshot;
            if (!deepEquals(nextState.formData, this.props.formData) &&
                !deepEquals(nextState.formData, prevState.formData) &&
                this.props.onChange) {
                this.props.onChange(nextState);
            }
            this.setState(nextState);
        }
    }
    /** Extracts the updated state from the given `props` and `inputFormData`. As part of this process, the
     * `inputFormData` is first processed to add any missing required defaults. After that, the data is run through the
     * validation process IF required by the `props`.
     *
     * @param props - The props passed to the `Form`
     * @param inputFormData - The new or current data for the `Form`
     * @param retrievedSchema - An expanded schema, if not provided, it will be retrieved from the `schema` and `formData`.
     * @param isSchemaChanged - A flag indicating whether the schema has changed.
     * @returns - The new state for the `Form`
     */
    getStateFromProps(props, inputFormData, retrievedSchema, isSchemaChanged = false) {
        var _a;
        const state = this.state || {};
        const schema = 'schema' in props ? props.schema : this.props.schema;
        const uiSchema = ('uiSchema' in props ? props.uiSchema : this.props.uiSchema) || {};
        const edit = typeof inputFormData !== 'undefined';
        const liveValidate = 'liveValidate' in props ? props.liveValidate : this.props.liveValidate;
        const mustValidate = edit && !props.noValidate && liveValidate;
        const rootSchema = schema;
        const experimental_defaultFormStateBehavior = 'experimental_defaultFormStateBehavior' in props
            ? props.experimental_defaultFormStateBehavior
            : this.props.experimental_defaultFormStateBehavior;
        let schemaUtils = state.schemaUtils;
        if (!schemaUtils ||
            schemaUtils.doesSchemaUtilsDiffer(props.validator, rootSchema, experimental_defaultFormStateBehavior)) {
            schemaUtils = createSchemaUtils(props.validator, rootSchema, experimental_defaultFormStateBehavior);
        }
        const formData = schemaUtils.getDefaultFormState(schema, inputFormData);
        const _retrievedSchema = retrievedSchema !== null && retrievedSchema !== void 0 ? retrievedSchema : schemaUtils.retrieveSchema(schema, formData);
        const getCurrentErrors = () => {
            // If the `props.noValidate` option is set or the schema has changed, we reset the error state.
            if (props.noValidate || isSchemaChanged) {
                return { errors: [], errorSchema: {} };
            }
            else if (!props.liveValidate) {
                return {
                    errors: state.schemaValidationErrors || [],
                    errorSchema: state.schemaValidationErrorSchema || {},
                };
            }
            return {
                errors: state.errors || [],
                errorSchema: state.errorSchema || {},
            };
        };
        let errors;
        let errorSchema;
        let schemaValidationErrors = state.schemaValidationErrors;
        let schemaValidationErrorSchema = state.schemaValidationErrorSchema;
        if (mustValidate) {
            const schemaValidation = this.validate(formData, schema, schemaUtils, _retrievedSchema);
            errors = schemaValidation.errors;
            // If the schema has changed, we do not merge state.errorSchema.
            // Else in the case where it hasn't changed, we merge 'state.errorSchema' with 'schemaValidation.errorSchema.' This done to display the raised field error.
            if (isSchemaChanged) {
                errorSchema = schemaValidation.errorSchema;
            }
            else {
                errorSchema = mergeObjects((_a = this.state) === null || _a === void 0 ? void 0 : _a.errorSchema, schemaValidation.errorSchema, 'preventDuplicates');
            }
            schemaValidationErrors = errors;
            schemaValidationErrorSchema = errorSchema;
        }
        else {
            const currentErrors = getCurrentErrors();
            errors = currentErrors.errors;
            errorSchema = currentErrors.errorSchema;
        }
        if (props.extraErrors) {
            const merged = validationDataMerge({ errorSchema, errors }, props.extraErrors);
            errorSchema = merged.errorSchema;
            errors = merged.errors;
        }
        const idSchema = schemaUtils.toIdSchema(_retrievedSchema, uiSchema['ui:rootFieldId'], formData, props.idPrefix, props.idSeparator);
        const nextState = {
            schemaUtils,
            schema,
            uiSchema,
            idSchema,
            formData,
            edit,
            errors,
            errorSchema,
            schemaValidationErrors,
            schemaValidationErrorSchema,
            retrievedSchema: _retrievedSchema,
        };
        return nextState;
    }
    /** React lifecycle method that is used to determine whether component should be updated.
     *
     * @param nextProps - The next version of the props
     * @param nextState - The next version of the state
     * @returns - True if the component should be updated, false otherwise
     */
    shouldComponentUpdate(nextProps, nextState) {
        return shouldRender(this, nextProps, nextState);
    }
    /** Validates the `formData` against the `schema` using the `altSchemaUtils` (if provided otherwise it uses the
     * `schemaUtils` in the state), returning the results.
     *
     * @param formData - The new form data to validate
     * @param schema - The schema used to validate against
     * @param altSchemaUtils - The alternate schemaUtils to use for validation
     */
    validate(formData, schema = this.props.schema, altSchemaUtils, retrievedSchema) {
        const schemaUtils = altSchemaUtils ? altSchemaUtils : this.state.schemaUtils;
        const { customValidate, transformErrors, uiSchema } = this.props;
        const resolvedSchema = retrievedSchema !== null && retrievedSchema !== void 0 ? retrievedSchema : schemaUtils.retrieveSchema(schema, formData);
        return schemaUtils
            .getValidator()
            .validateFormData(formData, resolvedSchema, customValidate, transformErrors, uiSchema);
    }
    /** Renders any errors contained in the `state` in using the `ErrorList`, if not disabled by `showErrorList`. */
    renderErrors(registry) {
        const { errors, errorSchema, schema, uiSchema } = this.state;
        const { formContext } = this.props;
        const options = getUiOptions(uiSchema);
        const ErrorListTemplate = getTemplate('ErrorListTemplate', registry, options);
        if (errors && errors.length) {
            return (_jsx(ErrorListTemplate, { errors: errors, errorSchema: errorSchema || {}, schema: schema, uiSchema: uiSchema, formContext: formContext, registry: registry }));
        }
        return null;
    }
    // Filtering errors based on your retrieved schema to only show errors for properties in the selected branch.
    filterErrorsBasedOnSchema(schemaErrors, resolvedSchema, formData) {
        const { retrievedSchema, schemaUtils } = this.state;
        const _retrievedSchema = resolvedSchema !== null && resolvedSchema !== void 0 ? resolvedSchema : retrievedSchema;
        const pathSchema = schemaUtils.toPathSchema(_retrievedSchema, '', formData);
        const fieldNames = this.getFieldNames(pathSchema, formData);
        const filteredErrors = _pick(schemaErrors, fieldNames);
        // If the root schema is of a primitive type, do not filter out the __errors
        if ((resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.type) !== 'object' && (resolvedSchema === null || resolvedSchema === void 0 ? void 0 : resolvedSchema.type) !== 'array') {
            filteredErrors.__errors = schemaErrors.__errors;
        }
        // Removing undefined and empty errors.
        const filterUndefinedErrors = (errors) => {
            _forEach(errors, (errorAtKey, errorKey) => {
                if (errorAtKey === undefined) {
                    delete errors[errorKey];
                }
                else if (typeof errorAtKey === 'object' && !Array.isArray(errorAtKey.__errors)) {
                    filterUndefinedErrors(errorAtKey);
                }
            });
            return errors;
        };
        return filterUndefinedErrors(filteredErrors);
    }
    /** Returns the registry for the form */
    getRegistry() {
        var _a;
        const { translateString: customTranslateString, uiSchema = {} } = this.props;
        const { schemaUtils } = this.state;
        const { fields, templates, widgets, formContext, translateString } = getDefaultRegistry();
        return {
            fields: { ...fields, ...this.props.fields },
            templates: {
                ...templates,
                ...this.props.templates,
                ButtonTemplates: {
                    ...templates.ButtonTemplates,
                    ...(_a = this.props.templates) === null || _a === void 0 ? void 0 : _a.ButtonTemplates,
                },
            },
            widgets: { ...widgets, ...this.props.widgets },
            rootSchema: this.props.schema,
            formContext: this.props.formContext || formContext,
            schemaUtils,
            translateString: customTranslateString || translateString,
            globalUiOptions: uiSchema[UI_GLOBAL_OPTIONS_KEY],
        };
    }
    /** Attempts to focus on the field associated with the `error`. Uses the `property` field to compute path of the error
     * field, then, using the `idPrefix` and `idSeparator` converts that path into an id. Then the input element with that
     * id is attempted to be found using the `formElement` ref. If it is located, then it is focused.
     *
     * @param error - The error on which to focus
     */
    focusOnError(error) {
        const { idPrefix = 'root', idSeparator = '_' } = this.props;
        const { property } = error;
        const path = _toPath(property);
        if (path[0] === '') {
            // Most of the time the `.foo` property results in the first element being empty, so replace it with the idPrefix
            path[0] = idPrefix;
        }
        else {
            // Otherwise insert the idPrefix into the first location using unshift
            path.unshift(idPrefix);
        }
        const elementId = path.join(idSeparator);
        let field = this.formElement.current.elements[elementId];
        if (!field) {
            // if not an exact match, try finding an input starting with the element id (like radio buttons or checkboxes)
            field = this.formElement.current.querySelector(`input[id^=${elementId}`);
        }
        if (field && field.length) {
            // If we got a list with length > 0
            field = field[0];
        }
        if (field) {
            field.focus();
        }
    }
    /** Programmatically validate the form.  If `omitExtraData` is true, the `formData` will first be filtered to remove
     * any extra data not in a form field. If `onError` is provided, then it will be called with the list of errors the
     * same way as would happen on form submission.
     *
     * @returns - True if the form is valid, false otherwise.
     */
    validateForm() {
        const { omitExtraData } = this.props;
        let { formData: newFormData } = this.state;
        if (omitExtraData === true) {
            newFormData = this.omitExtraData(newFormData);
        }
        return this.validateFormWithFormData(newFormData);
    }
    /** Renders the `Form` fields inside the <form> | `tagName` or `_internalFormWrapper`, rendering any errors if
     * needed along with the submit button or any children of the form.
     */
    render() {
        const { children, id, idPrefix, idSeparator, className = '', tagName, name, method, target, action, autoComplete, enctype, acceptcharset, acceptCharset, noHtml5Validate = false, disabled, readonly, formContext, showErrorList = 'top', _internalFormWrapper, } = this.props;
        const { schema, uiSchema, formData, errorSchema, idSchema } = this.state;
        const registry = this.getRegistry();
        const { SchemaField: _SchemaField } = registry.fields;
        const { SubmitButton } = registry.templates.ButtonTemplates;
        // The `semantic-ui` and `material-ui` themes have `_internalFormWrapper`s that take an `as` prop that is the
        // PropTypes.elementType to use for the inner tag, so we'll need to pass `tagName` along if it is provided.
        // NOTE, the `as` prop is native to `semantic-ui` and is emulated in the `material-ui` theme
        const as = _internalFormWrapper ? tagName : undefined;
        const FormTag = _internalFormWrapper || tagName || 'form';
        let { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions = {} } = getUiOptions(uiSchema);
        if (disabled) {
            submitOptions = { ...submitOptions, props: { ...submitOptions.props, disabled: true } };
        }
        const submitUiSchema = { [UI_OPTIONS_KEY]: { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions } };
        return (_jsxs(FormTag, { className: className ? className : 'rjsf', id: id, name: name, method: method, target: target, action: action, autoComplete: autoComplete, encType: enctype, acceptCharset: acceptCharset || acceptcharset, noValidate: noHtml5Validate, onSubmit: this.onSubmit, as: as, ref: this.formElement, children: [showErrorList === 'top' && this.renderErrors(registry), _jsx(_SchemaField, { name: '', schema: schema, uiSchema: uiSchema, errorSchema: errorSchema, idSchema: idSchema, idPrefix: idPrefix, idSeparator: idSeparator, formContext: formContext, formData: formData, onChange: this.onChange, onBlur: this.onBlur, onFocus: this.onFocus, registry: registry, disabled: disabled, readonly: readonly }), children ? children : _jsx(SubmitButton, { uiSchema: submitUiSchema, registry: registry }), showErrorList === 'bottom' && this.renderErrors(registry)] }));
    }
}
//# sourceMappingURL=Form.js.map