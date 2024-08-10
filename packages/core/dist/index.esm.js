// src/components/Form.tsx
import { Component as Component5, createRef } from "react";
import {
  createSchemaUtils,
  deepEquals as deepEquals3,
  getTemplate as getTemplate20,
  getUiOptions as getUiOptions12,
  isObject as isObject5,
  mergeObjects as mergeObjects2,
  NAME_KEY,
  RJSF_ADDITIONAL_PROPERTIES_FLAG,
  shouldRender,
  SUBMIT_BTN_OPTIONS_KEY,
  toErrorList,
  UI_GLOBAL_OPTIONS_KEY,
  UI_OPTIONS_KEY as UI_OPTIONS_KEY2,
  validationDataMerge
} from "@rjsf/utils";
import _forEach from "lodash/forEach";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _pick from "lodash/pick";
import _toPath from "lodash/toPath";

// src/getDefaultRegistry.ts
import { englishStringTranslator } from "@rjsf/utils";

// src/components/fields/ArrayField.tsx
import { Component } from "react";
import {
  getTemplate,
  getWidget,
  getUiOptions,
  isFixedItems,
  allowAdditionalItems,
  isCustomWidget,
  optionsList,
  TranslatableString,
  ITEMS_KEY
} from "@rjsf/utils";
import cloneDeep from "lodash/cloneDeep";
import get from "lodash/get";
import isObject from "lodash/isObject";
import set from "lodash/set";
import { nanoid } from "nanoid";
import { jsx } from "react/jsx-runtime";
function generateRowId() {
  return nanoid();
}
function generateKeyedFormData(formData) {
  return !Array.isArray(formData) ? [] : formData.map((item) => {
    return {
      key: generateRowId(),
      item
    };
  });
}
function keyedToPlainFormData(keyedFormData) {
  if (Array.isArray(keyedFormData)) {
    return keyedFormData.map((keyedItem) => keyedItem.item);
  }
  return [];
}
var ArrayField = class extends Component {
  /** Constructs an `ArrayField` from the `props`, generating the initial keyed data from the `formData`
   *
   * @param props - The `FieldProps` for this template
   */
  constructor(props) {
    super(props);
    /** Returns the default form information for an item based on the schema for that item. Deals with the possibility
     * that the schema is fixed and allows additional items.
     */
    this._getNewFormDataRow = () => {
      const { schema, registry } = this.props;
      const { schemaUtils } = registry;
      let itemSchema = schema.items;
      if (isFixedItems(schema) && allowAdditionalItems(schema)) {
        itemSchema = schema.additionalItems;
      }
      return schemaUtils.getDefaultFormState(itemSchema);
    };
    /** Callback handler for when the user clicks on the add button. Creates a new row of keyed form data at the end of
     * the list, adding it into the state, and then returning `onChange()` with the plain form data converted from the
     * keyed data
     *
     * @param event - The event for the click
     */
    this.onAddClick = (event) => {
      this._handleAddClick(event);
    };
    /** Callback handler for when the user clicks on the add button on an existing array element. Creates a new row of
     * keyed form data inserted at the `index`, adding it into the state, and then returning `onChange()` with the plain
     * form data converted from the keyed data
     *
     * @param index - The index at which the add button is clicked
     */
    this.onAddIndexClick = (index) => {
      return (event) => {
        this._handleAddClick(event, index);
      };
    };
    /** Callback handler for when the user clicks on the copy button on an existing array element. Clones the row of
     * keyed form data at the `index` into the next position in the state, and then returning `onChange()` with the plain
     * form data converted from the keyed data
     *
     * @param index - The index at which the copy button is clicked
     */
    this.onCopyIndexClick = (index) => {
      return (event) => {
        if (event) {
          event.preventDefault();
        }
        const { onChange, errorSchema } = this.props;
        const { keyedFormData } = this.state;
        let newErrorSchema;
        if (errorSchema) {
          newErrorSchema = {};
          for (const idx in errorSchema) {
            const i = parseInt(idx);
            if (i <= index) {
              set(newErrorSchema, [i], errorSchema[idx]);
            } else if (i > index) {
              set(newErrorSchema, [i + 1], errorSchema[idx]);
            }
          }
        }
        const newKeyedFormDataRow = {
          key: generateRowId(),
          item: cloneDeep(keyedFormData[index].item)
        };
        const newKeyedFormData = [...keyedFormData];
        if (index !== void 0) {
          newKeyedFormData.splice(index + 1, 0, newKeyedFormDataRow);
        } else {
          newKeyedFormData.push(newKeyedFormDataRow);
        }
        this.setState(
          {
            keyedFormData: newKeyedFormData,
            updatedKeyedFormData: true
          },
          () => onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema)
        );
      };
    };
    /** Callback handler for when the user clicks on the remove button on an existing array element. Removes the row of
     * keyed form data at the `index` in the state, and then returning `onChange()` with the plain form data converted
     * from the keyed data
     *
     * @param index - The index at which the remove button is clicked
     */
    this.onDropIndexClick = (index) => {
      return (event) => {
        if (event) {
          event.preventDefault();
        }
        const { onChange, errorSchema } = this.props;
        const { keyedFormData } = this.state;
        let newErrorSchema;
        if (errorSchema) {
          newErrorSchema = {};
          for (const idx in errorSchema) {
            const i = parseInt(idx);
            if (i < index) {
              set(newErrorSchema, [i], errorSchema[idx]);
            } else if (i > index) {
              set(newErrorSchema, [i - 1], errorSchema[idx]);
            }
          }
        }
        const newKeyedFormData = keyedFormData.filter((_, i) => i !== index);
        this.setState(
          {
            keyedFormData: newKeyedFormData,
            updatedKeyedFormData: true
          },
          () => onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema)
        );
      };
    };
    /** Callback handler for when the user clicks on one of the move item buttons on an existing array element. Moves the
     * row of keyed form data at the `index` to the `newIndex` in the state, and then returning `onChange()` with the
     * plain form data converted from the keyed data
     *
     * @param index - The index of the item to move
     * @param newIndex - The index to where the item is to be moved
     */
    this.onReorderClick = (index, newIndex) => {
      return (event) => {
        if (event) {
          event.preventDefault();
          event.currentTarget.blur();
        }
        const { onChange, errorSchema } = this.props;
        let newErrorSchema;
        if (errorSchema) {
          newErrorSchema = {};
          for (const idx in errorSchema) {
            const i = parseInt(idx);
            if (i == index) {
              set(newErrorSchema, [newIndex], errorSchema[index]);
            } else if (i == newIndex) {
              set(newErrorSchema, [index], errorSchema[newIndex]);
            } else {
              set(newErrorSchema, [idx], errorSchema[i]);
            }
          }
        }
        const { keyedFormData } = this.state;
        function reOrderArray() {
          const _newKeyedFormData = keyedFormData.slice();
          _newKeyedFormData.splice(index, 1);
          _newKeyedFormData.splice(newIndex, 0, keyedFormData[index]);
          return _newKeyedFormData;
        }
        const newKeyedFormData = reOrderArray();
        this.setState(
          {
            keyedFormData: newKeyedFormData
          },
          () => onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema)
        );
      };
    };
    /** Callback handler used to deal with changing the value of the data in the array at the `index`. Calls the
     * `onChange` callback with the updated form data
     *
     * @param index - The index of the item being changed
     */
    this.onChangeForIndex = (index) => {
      return (value, newErrorSchema, id) => {
        const { formData, onChange, errorSchema } = this.props;
        const arrayData = Array.isArray(formData) ? formData : [];
        const newFormData = arrayData.map((item, i) => {
          const jsonValue = typeof value === "undefined" ? null : value;
          return index === i ? jsonValue : item;
        });
        onChange(
          newFormData,
          errorSchema && errorSchema && {
            ...errorSchema,
            [index]: newErrorSchema
          },
          id
        );
      };
    };
    /** Callback handler used to change the value for a checkbox */
    this.onSelectChange = (value) => {
      const { onChange, idSchema } = this.props;
      onChange(value, void 0, idSchema && idSchema.$id);
    };
    const { formData = [] } = props;
    const keyedFormData = generateKeyedFormData(formData);
    this.state = {
      keyedFormData,
      updatedKeyedFormData: false
    };
  }
  /** React lifecycle method that is called when the props are about to change allowing the state to be updated. It
   * regenerates the keyed form data and returns it
   *
   * @param nextProps - The next set of props data
   * @param prevState - The previous set of state data
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.updatedKeyedFormData) {
      return {
        updatedKeyedFormData: false
      };
    }
    const nextFormData = Array.isArray(nextProps.formData) ? nextProps.formData : [];
    const previousKeyedFormData = prevState.keyedFormData || [];
    const newKeyedFormData = nextFormData.length === previousKeyedFormData.length ? previousKeyedFormData.map((previousKeyedFormDatum, index) => {
      return {
        key: previousKeyedFormDatum.key,
        item: nextFormData[index]
      };
    }) : generateKeyedFormData(nextFormData);
    return {
      keyedFormData: newKeyedFormData
    };
  }
  /** Returns the appropriate title for an item by getting first the title from the schema.items, then falling back to
   * the description from the schema.items, and finally the string "Item"
   */
  get itemTitle() {
    const { schema, registry } = this.props;
    const { translateString } = registry;
    return get(
      schema,
      [ITEMS_KEY, "title"],
      get(schema, [ITEMS_KEY, "description"], translateString(TranslatableString.ArrayItemTitle))
    );
  }
  /** Determines whether the item described in the schema is always required, which is determined by whether any item
   * may be null.
   *
   * @param itemSchema - The schema for the item
   * @return - True if the item schema type does not contain the "null" type
   */
  isItemRequired(itemSchema) {
    if (Array.isArray(itemSchema.type)) {
      return !itemSchema.type.includes("null");
    }
    return itemSchema.type !== "null";
  }
  /** Determines whether more items can be added to the array. If the uiSchema indicates the array doesn't allow adding
   * then false is returned. Otherwise, if the schema indicates that there are a maximum number of items and the
   * `formData` matches that value, then false is returned, otherwise true is returned.
   *
   * @param formItems - The list of items in the form
   * @returns - True if the item is addable otherwise false
   */
  canAddItem(formItems) {
    const { schema, uiSchema, registry } = this.props;
    let { addable } = getUiOptions(uiSchema, registry.globalUiOptions);
    if (addable !== false) {
      if (schema.maxItems !== void 0) {
        addable = formItems.length < schema.maxItems;
      } else {
        addable = true;
      }
    }
    return addable;
  }
  /** Callback handler for when the user clicks on the add or add at index buttons. Creates a new row of keyed form data
   * either at the end of the list (when index is not specified) or inserted at the `index` when it is, adding it into
   * the state, and then returning `onChange()` with the plain form data converted from the keyed data
   *
   * @param event - The event for the click
   * @param [index] - The optional index at which to add the new data
   */
  _handleAddClick(event, index) {
    if (event) {
      event.preventDefault();
    }
    const { onChange, errorSchema } = this.props;
    const { keyedFormData } = this.state;
    let newErrorSchema;
    if (errorSchema) {
      newErrorSchema = {};
      for (const idx in errorSchema) {
        const i = parseInt(idx);
        if (index === void 0 || i < index) {
          set(newErrorSchema, [i], errorSchema[idx]);
        } else if (i >= index) {
          set(newErrorSchema, [i + 1], errorSchema[idx]);
        }
      }
    }
    const newKeyedFormDataRow = {
      key: generateRowId(),
      item: this._getNewFormDataRow()
    };
    const newKeyedFormData = [...keyedFormData];
    if (index !== void 0) {
      newKeyedFormData.splice(index, 0, newKeyedFormDataRow);
    } else {
      newKeyedFormData.push(newKeyedFormDataRow);
    }
    this.setState(
      {
        keyedFormData: newKeyedFormData,
        updatedKeyedFormData: true
      },
      () => onChange(keyedToPlainFormData(newKeyedFormData), newErrorSchema)
    );
  }
  /** Renders the `ArrayField` depending on the specific needs of the schema and uischema elements
   */
  render() {
    const { schema, uiSchema, idSchema, registry } = this.props;
    const { schemaUtils, translateString } = registry;
    if (!(ITEMS_KEY in schema)) {
      const uiOptions = getUiOptions(uiSchema);
      const UnsupportedFieldTemplate = getTemplate(
        "UnsupportedFieldTemplate",
        registry,
        uiOptions
      );
      return /* @__PURE__ */ jsx(
        UnsupportedFieldTemplate,
        {
          schema,
          idSchema,
          reason: translateString(TranslatableString.MissingItems),
          registry
        }
      );
    }
    if (schemaUtils.isMultiSelect(schema)) {
      return this.renderMultiSelect();
    }
    if (isCustomWidget(uiSchema)) {
      return this.renderCustomWidget();
    }
    if (isFixedItems(schema)) {
      return this.renderFixedArray();
    }
    if (schemaUtils.isFilesArray(schema, uiSchema)) {
      return this.renderFiles();
    }
    return this.renderNormalArray();
  }
  /** Renders a normal array without any limitations of length
   */
  renderNormalArray() {
    const {
      schema,
      uiSchema = {},
      errorSchema,
      idSchema,
      name,
      title,
      disabled = false,
      readonly = false,
      autofocus = false,
      required = false,
      registry,
      onBlur,
      onFocus,
      idPrefix,
      idSeparator = "_",
      rawErrors
    } = this.props;
    const { keyedFormData } = this.state;
    const fieldTitle = schema.title || title || name;
    const { schemaUtils, formContext } = registry;
    const uiOptions = getUiOptions(uiSchema);
    const _schemaItems = isObject(schema.items) ? schema.items : {};
    const itemsSchema = schemaUtils.retrieveSchema(_schemaItems);
    const formData = keyedToPlainFormData(this.state.keyedFormData);
    const canAdd = this.canAddItem(formData);
    const arrayProps = {
      canAdd,
      items: keyedFormData.map((keyedItem, index) => {
        const { key, item } = keyedItem;
        const itemCast = item;
        const itemSchema = schemaUtils.retrieveSchema(_schemaItems, itemCast);
        const itemErrorSchema = errorSchema ? errorSchema[index] : void 0;
        const itemIdPrefix = idSchema.$id + idSeparator + index;
        const itemIdSchema = schemaUtils.toIdSchema(itemSchema, itemIdPrefix, itemCast, idPrefix, idSeparator);
        return this.renderArrayFieldItem({
          key,
          index,
          name: name && `${name}-${index}`,
          title: fieldTitle ? `${fieldTitle}-${index + 1}` : void 0,
          canAdd,
          canMoveUp: index > 0,
          canMoveDown: index < formData.length - 1,
          itemSchema,
          itemIdSchema,
          itemErrorSchema,
          itemData: itemCast,
          itemUiSchema: uiSchema.items,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
          rawErrors,
          totalItems: keyedFormData.length
        });
      }),
      className: `field field-array field-array-of-${itemsSchema.type}`,
      disabled,
      idSchema,
      uiSchema,
      onAddClick: this.onAddClick,
      readonly,
      required,
      schema,
      title: fieldTitle,
      formContext,
      formData,
      rawErrors,
      registry
    };
    const Template = getTemplate("ArrayFieldTemplate", registry, uiOptions);
    return /* @__PURE__ */ jsx(Template, { ...arrayProps });
  }
  /** Renders an array using the custom widget provided by the user in the `uiSchema`
   */
  renderCustomWidget() {
    const {
      schema,
      idSchema,
      uiSchema,
      disabled = false,
      readonly = false,
      autofocus = false,
      required = false,
      hideError,
      placeholder,
      onBlur,
      onFocus,
      formData: items = [],
      registry,
      rawErrors,
      name
    } = this.props;
    const { widgets: widgets2, formContext, globalUiOptions, schemaUtils } = registry;
    const { widget, title: uiTitle, ...options } = getUiOptions(uiSchema, globalUiOptions);
    const Widget = getWidget(schema, widget, widgets2);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    return /* @__PURE__ */ jsx(
      Widget,
      {
        id: idSchema.$id,
        name,
        multiple: true,
        onChange: this.onSelectChange,
        onBlur,
        onFocus,
        options,
        schema,
        uiSchema,
        registry,
        value: items,
        disabled,
        readonly,
        hideError,
        required,
        label,
        hideLabel: !displayLabel,
        placeholder,
        formContext,
        autofocus,
        rawErrors
      }
    );
  }
  /** Renders an array as a set of checkboxes
   */
  renderMultiSelect() {
    const {
      schema,
      idSchema,
      uiSchema,
      formData: items = [],
      disabled = false,
      readonly = false,
      autofocus = false,
      required = false,
      placeholder,
      onBlur,
      onFocus,
      registry,
      rawErrors,
      name
    } = this.props;
    const { widgets: widgets2, schemaUtils, formContext, globalUiOptions } = registry;
    const itemsSchema = schemaUtils.retrieveSchema(schema.items, items);
    const enumOptions = optionsList(itemsSchema, uiSchema);
    const { widget = "select", title: uiTitle, ...options } = getUiOptions(uiSchema, globalUiOptions);
    const Widget = getWidget(schema, widget, widgets2);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    return /* @__PURE__ */ jsx(
      Widget,
      {
        id: idSchema.$id,
        name,
        multiple: true,
        onChange: this.onSelectChange,
        onBlur,
        onFocus,
        options: { ...options, enumOptions },
        schema,
        uiSchema,
        registry,
        value: items,
        disabled,
        readonly,
        required,
        label,
        hideLabel: !displayLabel,
        placeholder,
        formContext,
        autofocus,
        rawErrors
      }
    );
  }
  /** Renders an array of files using the `FileWidget`
   */
  renderFiles() {
    const {
      schema,
      uiSchema,
      idSchema,
      name,
      disabled = false,
      readonly = false,
      autofocus = false,
      required = false,
      onBlur,
      onFocus,
      registry,
      formData: items = [],
      rawErrors
    } = this.props;
    const { widgets: widgets2, formContext, globalUiOptions, schemaUtils } = registry;
    const { widget = "files", title: uiTitle, ...options } = getUiOptions(uiSchema, globalUiOptions);
    const Widget = getWidget(schema, widget, widgets2);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    return /* @__PURE__ */ jsx(
      Widget,
      {
        options,
        id: idSchema.$id,
        name,
        multiple: true,
        onChange: this.onSelectChange,
        onBlur,
        onFocus,
        schema,
        uiSchema,
        value: items,
        disabled,
        readonly,
        required,
        registry,
        formContext,
        autofocus,
        rawErrors,
        label,
        hideLabel: !displayLabel
      }
    );
  }
  /** Renders an array that has a maximum limit of items
   */
  renderFixedArray() {
    const {
      schema,
      uiSchema = {},
      formData = [],
      errorSchema,
      idPrefix,
      idSeparator = "_",
      idSchema,
      name,
      title,
      disabled = false,
      readonly = false,
      autofocus = false,
      required = false,
      registry,
      onBlur,
      onFocus,
      rawErrors
    } = this.props;
    const { keyedFormData } = this.state;
    let { formData: items = [] } = this.props;
    const fieldTitle = schema.title || title || name;
    const uiOptions = getUiOptions(uiSchema);
    const { schemaUtils, formContext } = registry;
    const _schemaItems = isObject(schema.items) ? schema.items : [];
    const itemSchemas = _schemaItems.map(
      (item, index) => schemaUtils.retrieveSchema(item, formData[index])
    );
    const additionalSchema = isObject(schema.additionalItems) ? schemaUtils.retrieveSchema(schema.additionalItems, formData) : null;
    if (!items || items.length < itemSchemas.length) {
      items = items || [];
      items = items.concat(new Array(itemSchemas.length - items.length));
    }
    const canAdd = this.canAddItem(items) && !!additionalSchema;
    const arrayProps = {
      canAdd,
      className: "field field-array field-array-fixed-items",
      disabled,
      idSchema,
      formData,
      items: keyedFormData.map((keyedItem, index) => {
        const { key, item } = keyedItem;
        const itemCast = item;
        const additional = index >= itemSchemas.length;
        const itemSchema = (additional && isObject(schema.additionalItems) ? schemaUtils.retrieveSchema(schema.additionalItems, itemCast) : itemSchemas[index]) || {};
        const itemIdPrefix = idSchema.$id + idSeparator + index;
        const itemIdSchema = schemaUtils.toIdSchema(itemSchema, itemIdPrefix, itemCast, idPrefix, idSeparator);
        const itemUiSchema = additional ? uiSchema.additionalItems || {} : Array.isArray(uiSchema.items) ? uiSchema.items[index] : uiSchema.items || {};
        const itemErrorSchema = errorSchema ? errorSchema[index] : void 0;
        return this.renderArrayFieldItem({
          key,
          index,
          name: name && `${name}-${index}`,
          title: fieldTitle ? `${fieldTitle}-${index + 1}` : void 0,
          canAdd,
          canRemove: additional,
          canMoveUp: index >= itemSchemas.length + 1,
          canMoveDown: additional && index < items.length - 1,
          itemSchema,
          itemData: itemCast,
          itemUiSchema,
          itemIdSchema,
          itemErrorSchema,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
          rawErrors,
          totalItems: keyedFormData.length
        });
      }),
      onAddClick: this.onAddClick,
      readonly,
      required,
      registry,
      schema,
      uiSchema,
      title: fieldTitle,
      formContext,
      errorSchema,
      rawErrors
    };
    const Template = getTemplate("ArrayFieldTemplate", registry, uiOptions);
    return /* @__PURE__ */ jsx(Template, { ...arrayProps });
  }
  /** Renders the individual array item using a `SchemaField` along with the additional properties required to be send
   * back to the `ArrayFieldItemTemplate`.
   *
   * @param props - The props for the individual array item to be rendered
   */
  renderArrayFieldItem(props) {
    const {
      key,
      index,
      name,
      canAdd,
      canRemove = true,
      canMoveUp,
      canMoveDown,
      itemSchema,
      itemData,
      itemUiSchema,
      itemIdSchema,
      itemErrorSchema,
      autofocus,
      onBlur,
      onFocus,
      rawErrors,
      totalItems,
      title
    } = props;
    const { disabled, hideError, idPrefix, idSeparator, readonly, uiSchema, registry, formContext } = this.props;
    const {
      fields: { ArraySchemaField, SchemaField: SchemaField2 },
      globalUiOptions
    } = registry;
    const ItemSchemaField = ArraySchemaField || SchemaField2;
    const { orderable = true, removable = true, copyable = false } = getUiOptions(uiSchema, globalUiOptions);
    const has2 = {
      moveUp: orderable && canMoveUp,
      moveDown: orderable && canMoveDown,
      copy: copyable && canAdd,
      remove: removable && canRemove,
      toolbar: false
    };
    has2.toolbar = Object.keys(has2).some((key2) => has2[key2]);
    return {
      children: /* @__PURE__ */ jsx(
        ItemSchemaField,
        {
          name,
          title,
          index,
          schema: itemSchema,
          uiSchema: itemUiSchema,
          formData: itemData,
          formContext,
          errorSchema: itemErrorSchema,
          idPrefix,
          idSeparator,
          idSchema: itemIdSchema,
          required: this.isItemRequired(itemSchema),
          onChange: this.onChangeForIndex(index),
          onBlur,
          onFocus,
          registry,
          disabled,
          readonly,
          hideError,
          autofocus,
          rawErrors
        }
      ),
      className: "array-item",
      disabled,
      canAdd,
      hasCopy: has2.copy,
      hasToolbar: has2.toolbar,
      hasMoveUp: has2.moveUp,
      hasMoveDown: has2.moveDown,
      hasRemove: has2.remove,
      index,
      totalItems,
      key,
      onAddIndexClick: this.onAddIndexClick,
      onCopyIndexClick: this.onCopyIndexClick,
      onDropIndexClick: this.onDropIndexClick,
      onReorderClick: this.onReorderClick,
      readonly,
      registry,
      schema: itemSchema,
      uiSchema: itemUiSchema
    };
  }
};
var ArrayField_default = ArrayField;

// src/components/fields/BooleanField.tsx
import {
  getWidget as getWidget2,
  getUiOptions as getUiOptions2,
  optionsList as optionsList2,
  TranslatableString as TranslatableString2
} from "@rjsf/utils";
import isObject2 from "lodash/isObject";
import { jsx as jsx2 } from "react/jsx-runtime";
function BooleanField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    registry,
    required,
    disabled,
    readonly,
    hideError,
    autofocus,
    title,
    onChange,
    onFocus,
    onBlur,
    rawErrors
  } = props;
  const { title: schemaTitle } = schema;
  const { widgets: widgets2, formContext, translateString, globalUiOptions } = registry;
  const {
    widget = "checkbox",
    title: uiTitle,
    // Unlike the other fields, don't use `getDisplayLabel()` since it always returns false for the boolean type
    label: displayLabel = true,
    ...options
  } = getUiOptions2(uiSchema, globalUiOptions);
  const Widget = getWidget2(schema, widget, widgets2);
  const yes = translateString(TranslatableString2.YesLabel);
  const no = translateString(TranslatableString2.NoLabel);
  let enumOptions;
  const label = uiTitle ?? schemaTitle ?? title ?? name;
  if (Array.isArray(schema.oneOf)) {
    enumOptions = optionsList2(
      {
        oneOf: schema.oneOf.map((option) => {
          if (isObject2(option)) {
            return {
              ...option,
              title: option.title || (option.const === true ? yes : no)
            };
          }
          return void 0;
        }).filter((o) => o)
        // cast away the error that typescript can't grok is fixed
      },
      uiSchema
    );
  } else {
    const schemaWithEnumNames = schema;
    const enums = schema.enum ?? [true, false];
    if (!schemaWithEnumNames.enumNames && enums.length === 2 && enums.every((v) => typeof v === "boolean")) {
      enumOptions = [
        {
          value: enums[0],
          label: enums[0] ? yes : no
        },
        {
          value: enums[1],
          label: enums[1] ? yes : no
        }
      ];
    } else {
      enumOptions = optionsList2(
        {
          enum: enums,
          // NOTE: enumNames is deprecated, but still supported for now.
          enumNames: schemaWithEnumNames.enumNames
        },
        uiSchema
      );
    }
  }
  return /* @__PURE__ */ jsx2(
    Widget,
    {
      options: { ...options, enumOptions },
      schema,
      uiSchema,
      id: idSchema.$id,
      name,
      onChange,
      onFocus,
      onBlur,
      label,
      hideLabel: !displayLabel,
      value: formData,
      required,
      disabled,
      readonly,
      hideError,
      registry,
      formContext,
      autofocus,
      rawErrors
    }
  );
}
var BooleanField_default = BooleanField;

// src/components/fields/MultiSchemaField.tsx
import { Component as Component2 } from "react";
import get2 from "lodash/get";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import {
  ANY_OF_KEY,
  deepEquals,
  ERRORS_KEY,
  getDiscriminatorFieldFromSchema,
  getUiOptions as getUiOptions3,
  getWidget as getWidget3,
  mergeSchemas,
  ONE_OF_KEY,
  TranslatableString as TranslatableString3
} from "@rjsf/utils";
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var AnyOfField = class extends Component2 {
  /** Constructs an `AnyOfField` with the given `props` to initialize the initially selected option in state
   *
   * @param props - The `FieldProps` for this template
   */
  constructor(props) {
    super(props);
    /** Callback handler to remember what the currently selected option is. In addition to that the `formData` is updated
     * to remove properties that are not part of the newly selected option schema, and then the updated data is passed to
     * the `onChange` handler.
     *
     * @param option - The new option value being selected
     */
    this.onOptionChange = (option) => {
      const { selectedOption, retrievedOptions } = this.state;
      const { formData, onChange, registry } = this.props;
      const { schemaUtils } = registry;
      const intOption = option !== void 0 ? parseInt(option, 10) : -1;
      if (intOption === selectedOption) {
        return;
      }
      const newOption = intOption >= 0 ? retrievedOptions[intOption] : void 0;
      const oldOption = selectedOption >= 0 ? retrievedOptions[selectedOption] : void 0;
      let newFormData = schemaUtils.sanitizeDataForNewSchema(newOption, oldOption, formData);
      if (newFormData && newOption) {
        newFormData = schemaUtils.getDefaultFormState(newOption, newFormData, "excludeObjectChildren");
      }
      onChange(newFormData, void 0, this.getFieldId());
      this.setState({ selectedOption: intOption });
    };
    const {
      formData,
      options,
      registry: { schemaUtils }
    } = this.props;
    const retrievedOptions = options.map((opt) => schemaUtils.retrieveSchema(opt, formData));
    this.state = {
      retrievedOptions,
      selectedOption: this.getMatchingOption(0, formData, retrievedOptions)
    };
  }
  /** React lifecycle method that is called when the props and/or state for this component is updated. It recomputes the
   * currently selected option based on the overall `formData`
   *
   * @param prevProps - The previous `FieldProps` for this template
   * @param prevState - The previous `AnyOfFieldState` for this template
   */
  componentDidUpdate(prevProps, prevState) {
    const { formData, options, idSchema } = this.props;
    const { selectedOption } = this.state;
    let newState = this.state;
    if (!deepEquals(prevProps.options, options)) {
      const {
        registry: { schemaUtils }
      } = this.props;
      const retrievedOptions = options.map((opt) => schemaUtils.retrieveSchema(opt, formData));
      newState = { selectedOption, retrievedOptions };
    }
    if (!deepEquals(formData, prevProps.formData) && idSchema.$id === prevProps.idSchema.$id) {
      const { retrievedOptions } = newState;
      const matchingOption = this.getMatchingOption(selectedOption, formData, retrievedOptions);
      if (prevState && matchingOption !== selectedOption) {
        newState = { selectedOption: matchingOption, retrievedOptions };
      }
    }
    if (newState !== this.state) {
      this.setState(newState);
    }
  }
  /** Determines the best matching option for the given `formData` and `options`.
   *
   * @param formData - The new formData
   * @param options - The list of options to choose from
   * @return - The index of the `option` that best matches the `formData`
   */
  getMatchingOption(selectedOption, formData, options) {
    const {
      schema,
      registry: { schemaUtils }
    } = this.props;
    const discriminator = getDiscriminatorFieldFromSchema(schema);
    const option = schemaUtils.getClosestMatchingOption(formData, options, selectedOption, discriminator);
    return option;
  }
  getFieldId() {
    const { idSchema, schema } = this.props;
    return `${idSchema.$id}${schema.oneOf ? "__oneof_select" : "__anyof_select"}`;
  }
  /** Renders the `AnyOfField` selector along with a `SchemaField` for the value of the `formData`
   */
  render() {
    const {
      name,
      disabled = false,
      errorSchema = {},
      formContext,
      onBlur,
      onFocus,
      registry,
      schema,
      uiSchema
    } = this.props;
    const { widgets: widgets2, fields: fields2, translateString, globalUiOptions, schemaUtils } = registry;
    const { SchemaField: _SchemaField } = fields2;
    const { selectedOption, retrievedOptions } = this.state;
    const {
      widget = "select",
      placeholder,
      autofocus,
      autocomplete,
      title = schema.title,
      ...uiOptions
    } = getUiOptions3(uiSchema, globalUiOptions);
    const Widget = getWidget3({ type: "number" }, widget, widgets2);
    const rawErrors = get2(errorSchema, ERRORS_KEY, []);
    const fieldErrorSchema = omit(errorSchema, [ERRORS_KEY]);
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    const option = selectedOption >= 0 ? retrievedOptions[selectedOption] || null : null;
    let optionSchema;
    if (option) {
      const { required } = schema;
      optionSchema = required ? mergeSchemas({ required }, option) : option;
    }
    let optionsUiSchema = [];
    if (ONE_OF_KEY in schema && uiSchema && ONE_OF_KEY in uiSchema) {
      if (Array.isArray(uiSchema[ONE_OF_KEY])) {
        optionsUiSchema = uiSchema[ONE_OF_KEY];
      } else {
        console.warn(`uiSchema.oneOf is not an array for "${title || name}"`);
      }
    } else if (ANY_OF_KEY in schema && uiSchema && ANY_OF_KEY in uiSchema) {
      if (Array.isArray(uiSchema[ANY_OF_KEY])) {
        optionsUiSchema = uiSchema[ANY_OF_KEY];
      } else {
        console.warn(`uiSchema.anyOf is not an array for "${title || name}"`);
      }
    }
    let optionUiSchema = uiSchema;
    if (selectedOption >= 0 && optionsUiSchema.length > selectedOption) {
      optionUiSchema = optionsUiSchema[selectedOption];
    }
    const translateEnum = title ? TranslatableString3.TitleOptionPrefix : TranslatableString3.OptionPrefix;
    const translateParams = title ? [title] : [];
    const enumOptions = retrievedOptions.map((opt, index) => {
      const { title: uiTitle = opt.title } = getUiOptions3(optionsUiSchema[index]);
      return {
        label: uiTitle || translateString(translateEnum, translateParams.concat(String(index + 1))),
        value: index
      };
    });
    return /* @__PURE__ */ jsxs("div", { className: "panel panel-default panel-body", children: [
      /* @__PURE__ */ jsx3("div", { className: "form-group", children: /* @__PURE__ */ jsx3(
        Widget,
        {
          id: this.getFieldId(),
          name: `${name}${schema.oneOf ? "__oneof_select" : "__anyof_select"}`,
          schema: { type: "number", default: 0 },
          onChange: this.onOptionChange,
          onBlur,
          onFocus,
          disabled: disabled || isEmpty(enumOptions),
          multiple: false,
          rawErrors,
          errorSchema: fieldErrorSchema,
          value: selectedOption >= 0 ? selectedOption : void 0,
          options: { enumOptions, ...uiOptions },
          registry,
          formContext,
          placeholder,
          autocomplete,
          autofocus,
          label: title ?? name,
          hideLabel: !displayLabel
        }
      ) }),
      optionSchema && /* @__PURE__ */ jsx3(_SchemaField, { ...this.props, schema: optionSchema, uiSchema: optionUiSchema })
    ] });
  }
};
var MultiSchemaField_default = AnyOfField;

// src/components/fields/NumberField.tsx
import { useState, useCallback } from "react";
import { asNumber } from "@rjsf/utils";
import { jsx as jsx4 } from "react/jsx-runtime";
var trailingCharMatcherWithPrefix = /\.([0-9]*0)*$/;
var trailingCharMatcher = /[0.]0*$/;
function NumberField(props) {
  const { registry, onChange, formData, value: initialValue } = props;
  const [lastValue, setLastValue] = useState(initialValue);
  const { StringField: StringField2 } = registry.fields;
  let value = formData;
  const handleChange = useCallback(
    (value2) => {
      setLastValue(value2);
      if (`${value2}`.charAt(0) === ".") {
        value2 = `0${value2}`;
      }
      const processed = typeof value2 === "string" && value2.match(trailingCharMatcherWithPrefix) ? asNumber(value2.replace(trailingCharMatcher, "")) : asNumber(value2);
      onChange(processed);
    },
    [onChange]
  );
  if (typeof lastValue === "string" && typeof value === "number") {
    const re = new RegExp(`^(${String(value).replace(".", "\\.")})?\\.?0*$`);
    if (lastValue.match(re)) {
      value = lastValue;
    }
  }
  return /* @__PURE__ */ jsx4(StringField2, { ...props, formData: value, onChange: handleChange });
}
var NumberField_default = NumberField;

// src/components/fields/ObjectField.tsx
import { Component as Component3 } from "react";
import {
  getTemplate as getTemplate2,
  getUiOptions as getUiOptions4,
  orderProperties,
  TranslatableString as TranslatableString4,
  ADDITIONAL_PROPERTY_FLAG,
  PROPERTIES_KEY,
  REF_KEY,
  ANY_OF_KEY as ANY_OF_KEY2,
  ONE_OF_KEY as ONE_OF_KEY2
} from "@rjsf/utils";
import Markdown from "markdown-to-jsx";
import get3 from "lodash/get";
import has from "lodash/has";
import isObject3 from "lodash/isObject";
import set2 from "lodash/set";
import unset from "lodash/unset";
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var ObjectField = class extends Component3 {
  constructor() {
    super(...arguments);
    /** Set up the initial state */
    this.state = {
      wasPropertyKeyModified: false,
      additionalProperties: {}
    };
    /** Returns the `onPropertyChange` handler for the `name` field. Handles the special case where a user is attempting
     * to clear the data for a field added as an additional property. Calls the `onChange()` handler with the updated
     * formData.
     *
     * @param name - The name of the property
     * @param addedByAdditionalProperties - Flag indicating whether this property is an additional property
     * @returns - The onPropertyChange callback for the `name` property
     */
    this.onPropertyChange = (name, addedByAdditionalProperties = false) => {
      return (value, newErrorSchema, id) => {
        const { formData, onChange, errorSchema } = this.props;
        if (value === void 0 && addedByAdditionalProperties) {
          value = "";
        }
        const newFormData = { ...formData, [name]: value };
        onChange(
          newFormData,
          errorSchema && errorSchema && {
            ...errorSchema,
            [name]: newErrorSchema
          },
          id
        );
      };
    };
    /** Returns a callback to handle the onDropPropertyClick event for the given `key` which removes the old `key` data
     * and calls the `onChange` callback with it
     *
     * @param key - The key for which the drop callback is desired
     * @returns - The drop property click callback
     */
    this.onDropPropertyClick = (key) => {
      return (event) => {
        event.preventDefault();
        const { onChange, formData } = this.props;
        const copiedFormData = { ...formData };
        unset(copiedFormData, key);
        onChange(copiedFormData);
      };
    };
    /** Computes the next available key name from the `preferredKey`, indexing through the already existing keys until one
     * that is already not assigned is found.
     *
     * @param preferredKey - The preferred name of a new key
     * @param [formData] - The form data in which to check if the desired key already exists
     * @returns - The name of the next available key from `preferredKey`
     */
    this.getAvailableKey = (preferredKey, formData) => {
      const { uiSchema, registry } = this.props;
      const { duplicateKeySuffixSeparator = "-" } = getUiOptions4(uiSchema, registry.globalUiOptions);
      let index = 0;
      let newKey = preferredKey;
      while (has(formData, newKey)) {
        newKey = `${preferredKey}${duplicateKeySuffixSeparator}${++index}`;
      }
      return newKey;
    };
    /** Returns a callback function that deals with the rename of a key for an additional property for a schema. That
     * callback will attempt to rename the key and move the existing data to that key, calling `onChange` when it does.
     *
     * @param oldValue - The old value of a field
     * @returns - The key change callback function
     */
    this.onKeyChange = (oldValue) => {
      return (value, newErrorSchema) => {
        if (oldValue === value) {
          return;
        }
        const { formData, onChange, errorSchema } = this.props;
        value = this.getAvailableKey(value, formData);
        const newFormData = {
          ...formData
        };
        const newKeys = { [oldValue]: value };
        const keyValues = Object.keys(newFormData).map((key) => {
          const newKey = newKeys[key] || key;
          return { [newKey]: newFormData[key] };
        });
        const renamedObj = Object.assign({}, ...keyValues);
        this.setState({ wasPropertyKeyModified: true });
        onChange(
          renamedObj,
          errorSchema && errorSchema && {
            ...errorSchema,
            [value]: newErrorSchema
          }
        );
      };
    };
    /** Handles the adding of a new additional property on the given `schema`. Calls the `onChange` callback once the new
     * default data for that field has been added to the formData.
     *
     * @param schema - The schema element to which the new property is being added
     */
    this.handleAddClick = (schema) => () => {
      if (!schema.additionalProperties) {
        return;
      }
      const { formData, onChange, registry } = this.props;
      const newFormData = { ...formData };
      let type = void 0;
      let defaultValue = void 0;
      if (isObject3(schema.additionalProperties)) {
        type = schema.additionalProperties.type;
        defaultValue = schema.additionalProperties.default;
        let apSchema = schema.additionalProperties;
        if (REF_KEY in apSchema) {
          const { schemaUtils } = registry;
          apSchema = schemaUtils.retrieveSchema({ $ref: apSchema[REF_KEY] }, formData);
          type = apSchema.type;
          defaultValue = apSchema.default;
        }
        if (!type && (ANY_OF_KEY2 in apSchema || ONE_OF_KEY2 in apSchema)) {
          type = "object";
        }
      }
      const newKey = this.getAvailableKey("newKey", newFormData);
      set2(newFormData, newKey, defaultValue ?? this.getDefaultValue(type));
      onChange(newFormData);
    };
  }
  /** Returns a flag indicating whether the `name` field is required in the object schema
   *
   * @param name - The name of the field to check for required-ness
   * @returns - True if the field `name` is required, false otherwise
   */
  isRequired(name) {
    const { schema } = this.props;
    return Array.isArray(schema.required) && schema.required.indexOf(name) !== -1;
  }
  /** Returns a default value to be used for a new additional schema property of the given `type`
   *
   * @param type - The type of the new additional schema property
   */
  getDefaultValue(type) {
    const {
      registry: { translateString }
    } = this.props;
    switch (type) {
      case "array":
        return [];
      case "boolean":
        return false;
      case "null":
        return null;
      case "number":
        return 0;
      case "object":
        return {};
      case "string":
      default:
        return translateString(TranslatableString4.NewStringDefault);
    }
  }
  /** Renders the `ObjectField` from the given props
   */
  render() {
    const {
      schema: rawSchema,
      uiSchema = {},
      formData,
      errorSchema,
      idSchema,
      name,
      required = false,
      disabled,
      readonly,
      hideError,
      idPrefix,
      idSeparator,
      onBlur,
      onFocus,
      registry,
      title
    } = this.props;
    const { fields: fields2, formContext, schemaUtils, translateString, globalUiOptions } = registry;
    const { SchemaField: SchemaField2 } = fields2;
    const schema = schemaUtils.retrieveSchema(rawSchema, formData);
    const uiOptions = getUiOptions4(uiSchema, globalUiOptions);
    const { properties: schemaProperties = {} } = schema;
    const templateTitle = uiOptions.title ?? schema.title ?? title ?? name;
    const description = uiOptions.description ?? schema.description;
    let orderedProperties;
    try {
      const properties = Object.keys(schemaProperties);
      orderedProperties = orderProperties(properties, uiOptions.order);
    } catch (err) {
      return /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx5("p", { className: "config-error", style: { color: "red" }, children: /* @__PURE__ */ jsx5(Markdown, { options: { disableParsingRawHTML: true }, children: translateString(TranslatableString4.InvalidObjectField, [name || "root", err.message]) }) }),
        /* @__PURE__ */ jsx5("pre", { children: JSON.stringify(schema) })
      ] });
    }
    const Template = getTemplate2("ObjectFieldTemplate", registry, uiOptions);
    const templateProps = {
      // getDisplayLabel() always returns false for object types, so just check the `uiOptions.label`
      title: uiOptions.label === false ? "" : templateTitle,
      description: uiOptions.label === false ? void 0 : description,
      properties: orderedProperties.map((name2) => {
        const addedByAdditionalProperties = has(schema, [PROPERTIES_KEY, name2, ADDITIONAL_PROPERTY_FLAG]);
        const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name2];
        const hidden = getUiOptions4(fieldUiSchema).widget === "hidden";
        const fieldIdSchema = get3(idSchema, [name2], {});
        return {
          content: /* @__PURE__ */ jsx5(
            SchemaField2,
            {
              name: name2,
              required: this.isRequired(name2),
              schema: get3(schema, [PROPERTIES_KEY, name2], {}),
              uiSchema: fieldUiSchema,
              errorSchema: get3(errorSchema, name2),
              idSchema: fieldIdSchema,
              idPrefix,
              idSeparator,
              formData: get3(formData, name2),
              formContext,
              wasPropertyKeyModified: this.state.wasPropertyKeyModified,
              onKeyChange: this.onKeyChange(name2),
              onChange: this.onPropertyChange(name2, addedByAdditionalProperties),
              onBlur,
              onFocus,
              registry,
              disabled,
              readonly,
              hideError,
              onDropPropertyClick: this.onDropPropertyClick
            },
            name2
          ),
          name: name2,
          readonly,
          disabled,
          required,
          hidden
        };
      }),
      readonly,
      disabled,
      required,
      idSchema,
      uiSchema,
      errorSchema,
      schema,
      formData,
      formContext,
      registry
    };
    return /* @__PURE__ */ jsx5(Template, { ...templateProps, onAddClick: this.handleAddClick });
  }
};
var ObjectField_default = ObjectField;

// src/components/fields/SchemaField.tsx
import { useCallback as useCallback2, Component as Component4 } from "react";
import {
  ADDITIONAL_PROPERTY_FLAG as ADDITIONAL_PROPERTY_FLAG2,
  deepEquals as deepEquals2,
  descriptionId,
  getSchemaType,
  getTemplate as getTemplate3,
  getUiOptions as getUiOptions5,
  ID_KEY,
  mergeObjects,
  TranslatableString as TranslatableString5,
  UI_OPTIONS_KEY
} from "@rjsf/utils";
import isObject4 from "lodash/isObject";
import omit2 from "lodash/omit";
import Markdown2 from "markdown-to-jsx";
import { Fragment, jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField",
  null: "NullField"
};
function getFieldComponent(schema, uiOptions, idSchema, registry) {
  const field = uiOptions.field;
  const { fields: fields2, translateString } = registry;
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields2) {
    return fields2[field];
  }
  const schemaType = getSchemaType(schema);
  const type = Array.isArray(schemaType) ? schemaType[0] : schemaType || "";
  const schemaId = schema.$id;
  let componentName = COMPONENT_TYPES[type];
  if (schemaId && schemaId in fields2) {
    componentName = schemaId;
  }
  if (!componentName && (schema.anyOf || schema.oneOf)) {
    return () => null;
  }
  return componentName in fields2 ? fields2[componentName] : () => {
    const UnsupportedFieldTemplate = getTemplate3(
      "UnsupportedFieldTemplate",
      registry,
      uiOptions
    );
    return /* @__PURE__ */ jsx6(
      UnsupportedFieldTemplate,
      {
        schema,
        idSchema,
        reason: translateString(TranslatableString5.UnknownFieldType, [String(schema.type)]),
        registry
      }
    );
  };
}
function SchemaFieldRender(props) {
  const {
    schema: _schema,
    idSchema: _idSchema,
    uiSchema,
    formData,
    errorSchema,
    idPrefix,
    idSeparator,
    name,
    onChange,
    onKeyChange,
    onDropPropertyClick,
    required,
    registry,
    wasPropertyKeyModified = false
  } = props;
  const { formContext, schemaUtils, globalUiOptions } = registry;
  const uiOptions = getUiOptions5(uiSchema, globalUiOptions);
  const FieldTemplate2 = getTemplate3("FieldTemplate", registry, uiOptions);
  const DescriptionFieldTemplate = getTemplate3(
    "DescriptionFieldTemplate",
    registry,
    uiOptions
  );
  const FieldHelpTemplate2 = getTemplate3("FieldHelpTemplate", registry, uiOptions);
  const FieldErrorTemplate2 = getTemplate3("FieldErrorTemplate", registry, uiOptions);
  const schema = schemaUtils.retrieveSchema(_schema, formData);
  const fieldId = _idSchema[ID_KEY];
  const idSchema = mergeObjects(
    schemaUtils.toIdSchema(schema, fieldId, formData, idPrefix, idSeparator),
    _idSchema
  );
  const handleFieldComponentChange = useCallback2(
    (formData2, newErrorSchema, id2) => {
      const theId = id2 || fieldId;
      return onChange(formData2, newErrorSchema, theId);
    },
    [fieldId, onChange]
  );
  const FieldComponent = getFieldComponent(schema, uiOptions, idSchema, registry);
  const disabled = Boolean(uiOptions.disabled ?? props.disabled);
  const readonly = Boolean(uiOptions.readonly ?? (props.readonly || props.schema.readOnly || schema.readOnly));
  const uiSchemaHideError = uiOptions.hideError;
  const hideError = uiSchemaHideError === void 0 ? props.hideError : Boolean(uiSchemaHideError);
  const autofocus = Boolean(uiOptions.autofocus ?? props.autofocus);
  if (Object.keys(schema).length === 0) {
    return null;
  }
  const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
  const { __errors, ...fieldErrorSchema } = errorSchema || {};
  const fieldUiSchema = omit2(uiSchema, ["ui:classNames", "classNames", "ui:style"]);
  if (UI_OPTIONS_KEY in fieldUiSchema) {
    fieldUiSchema[UI_OPTIONS_KEY] = omit2(fieldUiSchema[UI_OPTIONS_KEY], ["classNames", "style"]);
  }
  const field = /* @__PURE__ */ jsx6(
    FieldComponent,
    {
      ...props,
      onChange: handleFieldComponentChange,
      idSchema,
      schema,
      uiSchema: fieldUiSchema,
      disabled,
      readonly,
      hideError,
      autofocus,
      errorSchema: fieldErrorSchema,
      formContext,
      rawErrors: __errors
    }
  );
  const id = idSchema[ID_KEY];
  let label;
  if (wasPropertyKeyModified) {
    label = name;
  } else {
    label = ADDITIONAL_PROPERTY_FLAG2 in schema ? name : uiOptions.title || props.schema.title || schema.title || props.title || name;
  }
  const description = uiOptions.description || props.schema.description || schema.description || "";
  const richDescription = uiOptions.enableMarkdownInDescription ? /* @__PURE__ */ jsx6(Markdown2, { options: { disableParsingRawHTML: true }, children: description }) : description;
  const help = uiOptions.help;
  const hidden = uiOptions.widget === "hidden";
  const classNames = ["form-group", "field", `field-${getSchemaType(schema)}`];
  if (!hideError && __errors && __errors.length > 0) {
    classNames.push("field-error has-error has-danger");
  }
  if (uiSchema?.classNames) {
    if (true) {
      console.warn(
        "'uiSchema.classNames' is deprecated and may be removed in a major release; Use 'ui:classNames' instead."
      );
    }
    classNames.push(uiSchema.classNames);
  }
  if (uiOptions.classNames) {
    classNames.push(uiOptions.classNames);
  }
  const helpComponent = /* @__PURE__ */ jsx6(
    FieldHelpTemplate2,
    {
      help,
      idSchema,
      schema,
      uiSchema,
      hasErrors: !hideError && __errors && __errors.length > 0,
      registry
    }
  );
  const errorsComponent = hideError || (schema.anyOf || schema.oneOf) && !schemaUtils.isSelect(schema) ? void 0 : /* @__PURE__ */ jsx6(
    FieldErrorTemplate2,
    {
      errors: __errors,
      errorSchema,
      idSchema,
      schema,
      uiSchema,
      registry
    }
  );
  const fieldProps = {
    description: /* @__PURE__ */ jsx6(
      DescriptionFieldTemplate,
      {
        id: descriptionId(id),
        description: richDescription,
        schema,
        uiSchema,
        registry
      }
    ),
    rawDescription: description,
    help: helpComponent,
    rawHelp: typeof help === "string" ? help : void 0,
    errors: errorsComponent,
    rawErrors: hideError ? void 0 : __errors,
    id,
    label,
    hidden,
    onChange,
    onKeyChange,
    onDropPropertyClick,
    required,
    disabled,
    readonly,
    hideError,
    displayLabel,
    classNames: classNames.join(" ").trim(),
    style: uiOptions.style,
    formContext,
    formData,
    schema,
    uiSchema,
    registry
  };
  const _AnyOfField = registry.fields.AnyOfField;
  const _OneOfField = registry.fields.OneOfField;
  const isReplacingAnyOrOneOf = uiSchema?.["ui:field"] && uiSchema?.["ui:fieldReplacesAnyOrOneOf"] === true;
  if (isReplacingAnyOrOneOf) {
    return /* @__PURE__ */ jsx6(FieldComponent, { ...fieldProps });
  }
  return /* @__PURE__ */ jsx6(FieldTemplate2, { ...fieldProps, children: /* @__PURE__ */ jsxs3(Fragment, { children: [
    field,
    schema.anyOf && !isReplacingAnyOrOneOf && !schemaUtils.isSelect(schema) && /* @__PURE__ */ jsx6(
      _AnyOfField,
      {
        name,
        disabled,
        readonly,
        hideError,
        errorSchema,
        formData,
        formContext,
        idPrefix,
        idSchema,
        idSeparator,
        onBlur: props.onBlur,
        onChange: props.onChange,
        onFocus: props.onFocus,
        options: schema.anyOf.map(
          (_schema2) => schemaUtils.retrieveSchema(isObject4(_schema2) ? _schema2 : {}, formData)
        ),
        registry,
        schema,
        uiSchema
      }
    ),
    schema.oneOf && !isReplacingAnyOrOneOf && !schemaUtils.isSelect(schema) && /* @__PURE__ */ jsx6(
      _OneOfField,
      {
        name,
        disabled,
        readonly,
        hideError,
        errorSchema,
        formData,
        formContext,
        idPrefix,
        idSchema,
        idSeparator,
        onBlur: props.onBlur,
        onChange: props.onChange,
        onFocus: props.onFocus,
        options: schema.oneOf.map(
          (_schema2) => schemaUtils.retrieveSchema(isObject4(_schema2) ? _schema2 : {}, formData)
        ),
        registry,
        schema,
        uiSchema
      }
    )
  ] }) });
}
var SchemaField = class extends Component4 {
  shouldComponentUpdate(nextProps) {
    return !deepEquals2(this.props, nextProps);
  }
  render() {
    return /* @__PURE__ */ jsx6(SchemaFieldRender, { ...this.props });
  }
};
var SchemaField_default = SchemaField;

// src/components/fields/StringField.tsx
import {
  getWidget as getWidget4,
  getUiOptions as getUiOptions6,
  optionsList as optionsList3,
  hasWidget
} from "@rjsf/utils";
import { jsx as jsx7 } from "react/jsx-runtime";
function StringField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled = false,
    readonly = false,
    autofocus = false,
    onChange,
    onBlur,
    onFocus,
    registry,
    rawErrors,
    hideError
  } = props;
  const { title, format } = schema;
  const { widgets: widgets2, formContext, schemaUtils, globalUiOptions } = registry;
  const enumOptions = schemaUtils.isSelect(schema) ? optionsList3(schema, uiSchema) : void 0;
  let defaultWidget = enumOptions ? "select" : "text";
  if (format && hasWidget(schema, format, widgets2)) {
    defaultWidget = format;
  }
  const { widget = defaultWidget, placeholder = "", title: uiTitle, ...options } = getUiOptions6(uiSchema);
  const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
  const label = uiTitle ?? title ?? name;
  const Widget = getWidget4(schema, widget, widgets2);
  return /* @__PURE__ */ jsx7(
    Widget,
    {
      options: { ...options, enumOptions },
      schema,
      uiSchema,
      id: idSchema.$id,
      name,
      label,
      hideLabel: !displayLabel,
      hideError,
      value: formData,
      onChange,
      onBlur,
      onFocus,
      required,
      disabled,
      readonly,
      formContext,
      autofocus,
      registry,
      placeholder,
      rawErrors
    }
  );
}
var StringField_default = StringField;

// src/components/fields/NullField.tsx
import { useEffect } from "react";
function NullField(props) {
  const { formData, onChange } = props;
  useEffect(() => {
    if (formData === void 0) {
      onChange(null);
    }
  }, [formData, onChange]);
  return null;
}
var NullField_default = NullField;

// src/components/fields/index.ts
function fields() {
  return {
    AnyOfField: MultiSchemaField_default,
    ArrayField: ArrayField_default,
    // ArrayField falls back to SchemaField if ArraySchemaField is not defined, which it isn't by default
    BooleanField: BooleanField_default,
    NumberField: NumberField_default,
    ObjectField: ObjectField_default,
    OneOfField: MultiSchemaField_default,
    SchemaField: SchemaField_default,
    StringField: StringField_default,
    NullField: NullField_default
  };
}
var fields_default = fields;

// src/components/templates/ArrayFieldDescriptionTemplate.tsx
import {
  descriptionId as descriptionId2,
  getTemplate as getTemplate4,
  getUiOptions as getUiOptions7
} from "@rjsf/utils";
import { jsx as jsx8 } from "react/jsx-runtime";
function ArrayFieldDescriptionTemplate(props) {
  const { idSchema, description, registry, schema, uiSchema } = props;
  const options = getUiOptions7(uiSchema, registry.globalUiOptions);
  const { label: displayLabel = true } = options;
  if (!description || !displayLabel) {
    return null;
  }
  const DescriptionFieldTemplate = getTemplate4(
    "DescriptionFieldTemplate",
    registry,
    options
  );
  return /* @__PURE__ */ jsx8(
    DescriptionFieldTemplate,
    {
      id: descriptionId2(idSchema),
      description,
      schema,
      uiSchema,
      registry
    }
  );
}

// src/components/templates/ArrayFieldItemTemplate.tsx
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
function ArrayFieldItemTemplate(props) {
  const {
    children,
    className,
    disabled,
    hasToolbar,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    hasCopy,
    index,
    onCopyIndexClick,
    onDropIndexClick,
    onReorderClick,
    readonly,
    registry,
    uiSchema
  } = props;
  const { CopyButton: CopyButton2, MoveDownButton: MoveDownButton2, MoveUpButton: MoveUpButton2, RemoveButton: RemoveButton2 } = registry.templates.ButtonTemplates;
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold"
  };
  return /* @__PURE__ */ jsxs4("div", { className, children: [
    /* @__PURE__ */ jsx9("div", { className: hasToolbar ? "col-xs-9" : "col-xs-12", children }),
    hasToolbar && /* @__PURE__ */ jsx9("div", { className: "col-xs-3 array-item-toolbox", children: /* @__PURE__ */ jsxs4(
      "div",
      {
        className: "btn-group",
        style: {
          display: "flex",
          justifyContent: "space-around"
        },
        children: [
          (hasMoveUp || hasMoveDown) && /* @__PURE__ */ jsx9(
            MoveUpButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly || !hasMoveUp,
              onClick: onReorderClick(index, index - 1),
              uiSchema,
              registry
            }
          ),
          (hasMoveUp || hasMoveDown) && /* @__PURE__ */ jsx9(
            MoveDownButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly || !hasMoveDown,
              onClick: onReorderClick(index, index + 1),
              uiSchema,
              registry
            }
          ),
          hasCopy && /* @__PURE__ */ jsx9(
            CopyButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly,
              onClick: onCopyIndexClick(index),
              uiSchema,
              registry
            }
          ),
          hasRemove && /* @__PURE__ */ jsx9(
            RemoveButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly,
              onClick: onDropIndexClick(index),
              uiSchema,
              registry
            }
          )
        ]
      }
    ) })
  ] });
}

// src/components/templates/ArrayFieldTemplate.tsx
import {
  getTemplate as getTemplate5,
  getUiOptions as getUiOptions8
} from "@rjsf/utils";
import { jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
function ArrayFieldTemplate(props) {
  const {
    canAdd,
    className,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title
  } = props;
  const uiOptions = getUiOptions8(uiSchema);
  const ArrayFieldDescriptionTemplate2 = getTemplate5(
    "ArrayFieldDescriptionTemplate",
    registry,
    uiOptions
  );
  const ArrayFieldItemTemplate2 = getTemplate5(
    "ArrayFieldItemTemplate",
    registry,
    uiOptions
  );
  const ArrayFieldTitleTemplate2 = getTemplate5(
    "ArrayFieldTitleTemplate",
    registry,
    uiOptions
  );
  const {
    ButtonTemplates: { AddButton: AddButton2 }
  } = registry.templates;
  return /* @__PURE__ */ jsxs5("fieldset", { className, id: idSchema.$id, children: [
    /* @__PURE__ */ jsx10(
      ArrayFieldTitleTemplate2,
      {
        idSchema,
        title: uiOptions.title || title,
        required,
        schema,
        uiSchema,
        registry
      }
    ),
    /* @__PURE__ */ jsx10(
      ArrayFieldDescriptionTemplate2,
      {
        idSchema,
        description: uiOptions.description || schema.description,
        schema,
        uiSchema,
        registry
      }
    ),
    /* @__PURE__ */ jsx10("div", { className: "row array-item-list", children: items && items.map(({ key, ...itemProps }) => /* @__PURE__ */ jsx10(ArrayFieldItemTemplate2, { ...itemProps }, key)) }),
    canAdd && /* @__PURE__ */ jsx10(
      AddButton2,
      {
        className: "array-item-add",
        onClick: onAddClick,
        disabled: disabled || readonly,
        uiSchema,
        registry
      }
    )
  ] });
}

// src/components/templates/ArrayFieldTitleTemplate.tsx
import {
  getTemplate as getTemplate6,
  getUiOptions as getUiOptions9,
  titleId
} from "@rjsf/utils";
import { jsx as jsx11 } from "react/jsx-runtime";
function ArrayFieldTitleTemplate(props) {
  const { idSchema, title, schema, uiSchema, required, registry } = props;
  const options = getUiOptions9(uiSchema, registry.globalUiOptions);
  const { label: displayLabel = true } = options;
  if (!title || !displayLabel) {
    return null;
  }
  const TitleFieldTemplate = getTemplate6(
    "TitleFieldTemplate",
    registry,
    options
  );
  return /* @__PURE__ */ jsx11(
    TitleFieldTemplate,
    {
      id: titleId(idSchema),
      title,
      required,
      schema,
      uiSchema,
      registry
    }
  );
}

// src/components/templates/BaseInputTemplate.tsx
import { useCallback as useCallback3 } from "react";
import {
  ariaDescribedByIds,
  examplesId,
  getInputProps
} from "@rjsf/utils";
import { Fragment as Fragment2, jsx as jsx12, jsxs as jsxs6 } from "react/jsx-runtime";
function BaseInputTemplate(props) {
  const {
    id,
    name,
    // remove this from ...rest
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    onChangeOverride,
    options,
    schema,
    uiSchema,
    formContext,
    registry,
    rawErrors,
    type,
    hideLabel,
    // remove this from ...rest
    hideError,
    // remove this from ...rest
    ...rest
  } = props;
  if (!id) {
    console.log("No id for", props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const inputProps = {
    ...rest,
    ...getInputProps(schema, type, options)
  };
  let inputValue;
  if (inputProps.type === "number" || inputProps.type === "integer") {
    inputValue = value || value === 0 ? value : "";
  } else {
    inputValue = value == null ? "" : value;
  }
  const _onChange = useCallback3(
    ({ target: { value: value2 } }) => onChange(value2 === "" ? options.emptyValue : value2),
    [onChange, options]
  );
  const _onBlur = useCallback3(
    ({ target }) => onBlur(id, target && target.value),
    [onBlur, id]
  );
  const _onFocus = useCallback3(
    ({ target }) => onFocus(id, target && target.value),
    [onFocus, id]
  );
  return /* @__PURE__ */ jsxs6(Fragment2, { children: [
    /* @__PURE__ */ jsx12(
      "input",
      {
        id,
        name: id,
        className: "form-control",
        readOnly: readonly,
        disabled,
        autoFocus: autofocus,
        value: inputValue,
        ...inputProps,
        list: schema.examples ? examplesId(id) : void 0,
        onChange: onChangeOverride || _onChange,
        onBlur: _onBlur,
        onFocus: _onFocus,
        "aria-describedby": ariaDescribedByIds(id, !!schema.examples)
      }
    ),
    Array.isArray(schema.examples) && /* @__PURE__ */ jsx12("datalist", { id: examplesId(id), children: schema.examples.concat(schema.default && !schema.examples.includes(schema.default) ? [schema.default] : []).map((example) => {
      return /* @__PURE__ */ jsx12("option", { value: example }, example);
    }) }, `datalist_${id}`)
  ] });
}

// src/components/templates/ButtonTemplates/SubmitButton.tsx
import { getSubmitButtonOptions } from "@rjsf/utils";
import { jsx as jsx13 } from "react/jsx-runtime";
function SubmitButton({ uiSchema }) {
  const { submitText, norender, props: submitButtonProps = {} } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  return /* @__PURE__ */ jsx13("div", { children: /* @__PURE__ */ jsx13("button", { type: "submit", ...submitButtonProps, className: `btn btn-info ${submitButtonProps.className || ""}`, children: submitText }) });
}

// src/components/templates/ButtonTemplates/AddButton.tsx
import { TranslatableString as TranslatableString7 } from "@rjsf/utils";

// src/components/templates/ButtonTemplates/IconButton.tsx
import { TranslatableString as TranslatableString6 } from "@rjsf/utils";
import { jsx as jsx14 } from "react/jsx-runtime";
function IconButton(props) {
  const { iconType = "default", icon, className, uiSchema, registry, ...otherProps } = props;
  return /* @__PURE__ */ jsx14("button", { type: "button", className: `btn btn-${iconType} ${className}`, ...otherProps, children: /* @__PURE__ */ jsx14("i", { className: `glyphicon glyphicon-${icon}` }) });
}
function CopyButton(props) {
  const {
    registry: { translateString }
  } = props;
  return /* @__PURE__ */ jsx14(
    IconButton,
    {
      title: translateString(TranslatableString6.CopyButton),
      className: "array-item-copy",
      ...props,
      icon: "copy"
    }
  );
}
function MoveDownButton(props) {
  const {
    registry: { translateString }
  } = props;
  return /* @__PURE__ */ jsx14(
    IconButton,
    {
      title: translateString(TranslatableString6.MoveDownButton),
      className: "array-item-move-down",
      ...props,
      icon: "arrow-down"
    }
  );
}
function MoveUpButton(props) {
  const {
    registry: { translateString }
  } = props;
  return /* @__PURE__ */ jsx14(
    IconButton,
    {
      title: translateString(TranslatableString6.MoveUpButton),
      className: "array-item-move-up",
      ...props,
      icon: "arrow-up"
    }
  );
}
function RemoveButton(props) {
  const {
    registry: { translateString }
  } = props;
  return /* @__PURE__ */ jsx14(
    IconButton,
    {
      title: translateString(TranslatableString6.RemoveButton),
      className: "array-item-remove",
      ...props,
      iconType: "danger",
      icon: "remove"
    }
  );
}

// src/components/templates/ButtonTemplates/AddButton.tsx
import { jsx as jsx15 } from "react/jsx-runtime";
function AddButton({
  className,
  onClick,
  disabled,
  registry
}) {
  const { translateString } = registry;
  return /* @__PURE__ */ jsx15("div", { className: "row", children: /* @__PURE__ */ jsx15("p", { className: `col-xs-3 col-xs-offset-9 text-right ${className}`, children: /* @__PURE__ */ jsx15(
    IconButton,
    {
      iconType: "info",
      icon: "plus",
      className: "btn-add col-xs-12",
      title: translateString(TranslatableString7.AddButton),
      onClick,
      disabled,
      registry
    }
  ) }) });
}

// src/components/templates/ButtonTemplates/index.ts
function buttonTemplates() {
  return {
    SubmitButton,
    AddButton,
    CopyButton,
    MoveDownButton,
    MoveUpButton,
    RemoveButton
  };
}
var ButtonTemplates_default = buttonTemplates;

// src/components/templates/DescriptionField.tsx
import { jsx as jsx16 } from "react/jsx-runtime";
function DescriptionField(props) {
  const { id, description } = props;
  if (!description) {
    return null;
  }
  if (typeof description === "string") {
    return /* @__PURE__ */ jsx16("p", { id, className: "field-description", children: description });
  } else {
    return /* @__PURE__ */ jsx16("div", { id, className: "field-description", children: description });
  }
}

// src/components/templates/ErrorList.tsx
import {
  TranslatableString as TranslatableString8
} from "@rjsf/utils";
import { jsx as jsx17, jsxs as jsxs7 } from "react/jsx-runtime";
function ErrorList({
  errors,
  registry
}) {
  const { translateString } = registry;
  return /* @__PURE__ */ jsxs7("div", { className: "panel panel-danger errors", children: [
    /* @__PURE__ */ jsx17("div", { className: "panel-heading", children: /* @__PURE__ */ jsx17("h3", { className: "panel-title", children: translateString(TranslatableString8.ErrorsLabel) }) }),
    /* @__PURE__ */ jsx17("ul", { className: "list-group", children: errors.map((error, i) => {
      return /* @__PURE__ */ jsx17("li", { className: "list-group-item text-danger", children: error.stack }, i);
    }) })
  ] });
}

// src/components/templates/FieldTemplate/FieldTemplate.tsx
import {
  getTemplate as getTemplate7,
  getUiOptions as getUiOptions10
} from "@rjsf/utils";

// src/components/templates/FieldTemplate/Label.tsx
import { jsx as jsx18, jsxs as jsxs8 } from "react/jsx-runtime";
var REQUIRED_FIELD_SYMBOL = "*";
function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    return null;
  }
  return /* @__PURE__ */ jsxs8("label", { className: "control-label", htmlFor: id, children: [
    label,
    required && /* @__PURE__ */ jsx18("span", { className: "required", children: REQUIRED_FIELD_SYMBOL })
  ] });
}

// src/components/templates/FieldTemplate/FieldTemplate.tsx
import { jsx as jsx19, jsxs as jsxs9 } from "react/jsx-runtime";
function FieldTemplate(props) {
  const { id, label, children, errors, help, description, hidden, required, displayLabel, registry, uiSchema } = props;
  const uiOptions = getUiOptions10(uiSchema);
  const WrapIfAdditionalTemplate2 = getTemplate7(
    "WrapIfAdditionalTemplate",
    registry,
    uiOptions
  );
  if (hidden) {
    return /* @__PURE__ */ jsx19("div", { className: "hidden", children });
  }
  return /* @__PURE__ */ jsxs9(WrapIfAdditionalTemplate2, { ...props, children: [
    displayLabel && /* @__PURE__ */ jsx19(Label, { label, required, id }),
    displayLabel && description ? description : null,
    children,
    errors,
    help
  ] });
}

// src/components/templates/FieldTemplate/index.ts
var FieldTemplate_default = FieldTemplate;

// src/components/templates/FieldErrorTemplate.tsx
import { errorId } from "@rjsf/utils";
import { jsx as jsx20 } from "react/jsx-runtime";
function FieldErrorTemplate(props) {
  const { errors = [], idSchema } = props;
  if (errors.length === 0) {
    return null;
  }
  const id = errorId(idSchema);
  return /* @__PURE__ */ jsx20("div", { children: /* @__PURE__ */ jsx20("ul", { id, className: "error-detail bs-callout bs-callout-info", children: errors.filter((elem) => !!elem).map((error, index) => {
    return /* @__PURE__ */ jsx20("li", { className: "text-danger", children: error }, index);
  }) }) });
}

// src/components/templates/FieldHelpTemplate.tsx
import { helpId } from "@rjsf/utils";
import { jsx as jsx21 } from "react/jsx-runtime";
function FieldHelpTemplate(props) {
  const { idSchema, help } = props;
  if (!help) {
    return null;
  }
  const id = helpId(idSchema);
  if (typeof help === "string") {
    return /* @__PURE__ */ jsx21("p", { id, className: "help-block", children: help });
  }
  return /* @__PURE__ */ jsx21("div", { id, className: "help-block", children: help });
}

// src/components/templates/ObjectFieldTemplate.tsx
import {
  canExpand,
  descriptionId as descriptionId3,
  getTemplate as getTemplate8,
  getUiOptions as getUiOptions11,
  titleId as titleId2
} from "@rjsf/utils";
import { jsx as jsx22, jsxs as jsxs10 } from "react/jsx-runtime";
function ObjectFieldTemplate(props) {
  const {
    description,
    disabled,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema
  } = props;
  const options = getUiOptions11(uiSchema);
  const TitleFieldTemplate = getTemplate8("TitleFieldTemplate", registry, options);
  const DescriptionFieldTemplate = getTemplate8(
    "DescriptionFieldTemplate",
    registry,
    options
  );
  const {
    ButtonTemplates: { AddButton: AddButton2 }
  } = registry.templates;
  return /* @__PURE__ */ jsxs10("fieldset", { id: idSchema.$id, children: [
    title && /* @__PURE__ */ jsx22(
      TitleFieldTemplate,
      {
        id: titleId2(idSchema),
        title,
        required,
        schema,
        uiSchema,
        registry
      }
    ),
    description && /* @__PURE__ */ jsx22(
      DescriptionFieldTemplate,
      {
        id: descriptionId3(idSchema),
        description,
        schema,
        uiSchema,
        registry
      }
    ),
    properties.map((prop) => prop.content),
    canExpand(schema, uiSchema, formData) && /* @__PURE__ */ jsx22(
      AddButton2,
      {
        className: "object-property-expand",
        onClick: onAddClick(schema),
        disabled: disabled || readonly,
        uiSchema,
        registry
      }
    )
  ] });
}

// src/components/templates/TitleField.tsx
import { jsx as jsx23, jsxs as jsxs11 } from "react/jsx-runtime";
var REQUIRED_FIELD_SYMBOL2 = "*";
function TitleField(props) {
  const { id, title, required } = props;
  return /* @__PURE__ */ jsxs11("legend", { id, children: [
    title,
    required && /* @__PURE__ */ jsx23("span", { className: "required", children: REQUIRED_FIELD_SYMBOL2 })
  ] });
}

// src/components/templates/UnsupportedField.tsx
import { TranslatableString as TranslatableString9 } from "@rjsf/utils";
import Markdown3 from "markdown-to-jsx";
import { jsx as jsx24, jsxs as jsxs12 } from "react/jsx-runtime";
function UnsupportedField(props) {
  const { schema, idSchema, reason, registry } = props;
  const { translateString } = registry;
  let translateEnum = TranslatableString9.UnsupportedField;
  const translateParams = [];
  if (idSchema && idSchema.$id) {
    translateEnum = TranslatableString9.UnsupportedFieldWithId;
    translateParams.push(idSchema.$id);
  }
  if (reason) {
    translateEnum = translateEnum === TranslatableString9.UnsupportedField ? TranslatableString9.UnsupportedFieldWithReason : TranslatableString9.UnsupportedFieldWithIdAndReason;
    translateParams.push(reason);
  }
  return /* @__PURE__ */ jsxs12("div", { className: "unsupported-field", children: [
    /* @__PURE__ */ jsx24("p", { children: /* @__PURE__ */ jsx24(Markdown3, { options: { disableParsingRawHTML: true }, children: translateString(translateEnum, translateParams) }) }),
    schema && /* @__PURE__ */ jsx24("pre", { children: JSON.stringify(schema, null, 2) })
  ] });
}
var UnsupportedField_default = UnsupportedField;

// src/components/templates/WrapIfAdditionalTemplate.tsx
import {
  ADDITIONAL_PROPERTY_FLAG as ADDITIONAL_PROPERTY_FLAG3,
  TranslatableString as TranslatableString10
} from "@rjsf/utils";
import { jsx as jsx25, jsxs as jsxs13 } from "react/jsx-runtime";
function WrapIfAdditionalTemplate(props) {
  const {
    id,
    classNames,
    style,
    disabled,
    label,
    onKeyChange,
    onDropPropertyClick,
    readonly,
    required,
    schema,
    children,
    uiSchema,
    registry
  } = props;
  const { templates: templates2, translateString } = registry;
  const { RemoveButton: RemoveButton2 } = templates2.ButtonTemplates;
  const keyLabel = translateString(TranslatableString10.KeyLabel, [label]);
  const additional = ADDITIONAL_PROPERTY_FLAG3 in schema;
  if (!additional) {
    return /* @__PURE__ */ jsx25("div", { className: classNames, style, children });
  }
  return /* @__PURE__ */ jsx25("div", { className: classNames, style, children: /* @__PURE__ */ jsxs13("div", { className: "row", children: [
    /* @__PURE__ */ jsx25("div", { className: "col-xs-5 form-additional", children: /* @__PURE__ */ jsxs13("div", { className: "form-group", children: [
      /* @__PURE__ */ jsx25(Label, { label: keyLabel, required, id: `${id}-key` }),
      /* @__PURE__ */ jsx25(
        "input",
        {
          className: "form-control",
          type: "text",
          id: `${id}-key`,
          onBlur: ({ target }) => onKeyChange(target && target.value),
          defaultValue: label
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx25("div", { className: "form-additional form-group col-xs-5", children }),
    /* @__PURE__ */ jsx25("div", { className: "col-xs-2", children: /* @__PURE__ */ jsx25(
      RemoveButton2,
      {
        className: "array-item-remove btn-block",
        style: { border: "0" },
        disabled: disabled || readonly,
        onClick: onDropPropertyClick(label),
        uiSchema,
        registry
      }
    ) })
  ] }) });
}

// src/components/templates/index.ts
function templates() {
  return {
    ArrayFieldDescriptionTemplate,
    ArrayFieldItemTemplate,
    ArrayFieldTemplate,
    ArrayFieldTitleTemplate,
    ButtonTemplates: ButtonTemplates_default(),
    BaseInputTemplate,
    DescriptionFieldTemplate: DescriptionField,
    ErrorListTemplate: ErrorList,
    FieldTemplate: FieldTemplate_default,
    FieldErrorTemplate,
    FieldHelpTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate: TitleField,
    UnsupportedFieldTemplate: UnsupportedField_default,
    WrapIfAdditionalTemplate
  };
}
var templates_default = templates;

// src/components/widgets/AltDateWidget.tsx
import { useCallback as useCallback4, useEffect as useEffect2, useReducer, useState as useState2 } from "react";
import {
  ariaDescribedByIds as ariaDescribedByIds2,
  dateRangeOptions,
  parseDateString,
  toDateString,
  TranslatableString as TranslatableString11,
  getDateElementProps
} from "@rjsf/utils";
import { jsx as jsx26, jsxs as jsxs14 } from "react/jsx-runtime";
function readyForChange(state) {
  return Object.values(state).every((value) => value !== -1);
}
function DateElement({
  type,
  range,
  value,
  select,
  rootId,
  name,
  disabled,
  readonly,
  autofocus,
  registry,
  onBlur,
  onFocus
}) {
  const id = rootId + "_" + type;
  const { SelectWidget: SelectWidget2 } = registry.widgets;
  return /* @__PURE__ */ jsx26(
    SelectWidget2,
    {
      schema: { type: "integer" },
      id,
      name,
      className: "form-control",
      options: { enumOptions: dateRangeOptions(range[0], range[1]) },
      placeholder: type,
      value,
      disabled,
      readonly,
      autofocus,
      onChange: (value2) => select(type, value2),
      onBlur,
      onFocus,
      registry,
      label: "",
      "aria-describedby": ariaDescribedByIds2(rootId)
    }
  );
}
function AltDateWidget({
  time = false,
  disabled = false,
  readonly = false,
  autofocus = false,
  options,
  id,
  name,
  registry,
  onBlur,
  onFocus,
  onChange,
  value
}) {
  const { translateString } = registry;
  const [lastValue, setLastValue] = useState2(value);
  const [state, setState] = useReducer((state2, action) => {
    return { ...state2, ...action };
  }, parseDateString(value, time));
  useEffect2(() => {
    const stateValue = toDateString(state, time);
    if (readyForChange(state) && stateValue !== value) {
      onChange(stateValue);
    } else if (lastValue !== value) {
      setLastValue(value);
      setState(parseDateString(value, time));
    }
  }, [time, value, onChange, state, lastValue]);
  const handleChange = useCallback4((property, value2) => {
    setState({ [property]: value2 });
  }, []);
  const handleSetNow = useCallback4(
    (event) => {
      event.preventDefault();
      if (disabled || readonly) {
        return;
      }
      const nextState = parseDateString((/* @__PURE__ */ new Date()).toJSON(), time);
      onChange(toDateString(nextState, time));
    },
    [disabled, readonly, time]
  );
  const handleClear = useCallback4(
    (event) => {
      event.preventDefault();
      if (disabled || readonly) {
        return;
      }
      onChange(void 0);
    },
    [disabled, readonly, onChange]
  );
  return /* @__PURE__ */ jsxs14("ul", { className: "list-inline", children: [
    getDateElementProps(
      state,
      time,
      options.yearsRange,
      options.format
    ).map((elemProps, i) => /* @__PURE__ */ jsx26("li", { className: "list-inline-item", children: /* @__PURE__ */ jsx26(
      DateElement,
      {
        rootId: id,
        name,
        select: handleChange,
        ...elemProps,
        disabled,
        readonly,
        registry,
        onBlur,
        onFocus,
        autofocus: autofocus && i === 0
      }
    ) }, i)),
    (options.hideNowButton !== "undefined" ? !options.hideNowButton : true) && /* @__PURE__ */ jsx26("li", { className: "list-inline-item", children: /* @__PURE__ */ jsx26("a", { href: "#", className: "btn btn-info btn-now", onClick: handleSetNow, children: translateString(TranslatableString11.NowLabel) }) }),
    (options.hideClearButton !== "undefined" ? !options.hideClearButton : true) && /* @__PURE__ */ jsx26("li", { className: "list-inline-item", children: /* @__PURE__ */ jsx26("a", { href: "#", className: "btn btn-warning btn-clear", onClick: handleClear, children: translateString(TranslatableString11.ClearLabel) }) })
  ] });
}
var AltDateWidget_default = AltDateWidget;

// src/components/widgets/AltDateTimeWidget.tsx
import { jsx as jsx27 } from "react/jsx-runtime";
function AltDateTimeWidget({
  time = true,
  ...props
}) {
  const { AltDateWidget: AltDateWidget2 } = props.registry.widgets;
  return /* @__PURE__ */ jsx27(AltDateWidget2, { time, ...props });
}
var AltDateTimeWidget_default = AltDateTimeWidget;

// src/components/widgets/CheckboxWidget.tsx
import { useCallback as useCallback5 } from "react";
import {
  ariaDescribedByIds as ariaDescribedByIds3,
  descriptionId as descriptionId4,
  getTemplate as getTemplate9,
  labelValue,
  schemaRequiresTrueValue
} from "@rjsf/utils";
import { jsx as jsx28, jsxs as jsxs15 } from "react/jsx-runtime";
function CheckboxWidget({
  schema,
  uiSchema,
  options,
  id,
  value,
  disabled,
  readonly,
  label,
  hideLabel,
  autofocus = false,
  onBlur,
  onFocus,
  onChange,
  registry
}) {
  const DescriptionFieldTemplate = getTemplate9(
    "DescriptionFieldTemplate",
    registry,
    options
  );
  const required = schemaRequiresTrueValue(schema);
  const handleChange = useCallback5(
    (event) => onChange(event.target.checked),
    [onChange]
  );
  const handleBlur = useCallback5(
    (event) => onBlur(id, event.target.checked),
    [onBlur, id]
  );
  const handleFocus = useCallback5(
    (event) => onFocus(id, event.target.checked),
    [onFocus, id]
  );
  const description = options.description ?? schema.description;
  return /* @__PURE__ */ jsxs15("div", { className: `checkbox ${disabled || readonly ? "disabled" : ""}`, children: [
    !hideLabel && !!description && /* @__PURE__ */ jsx28(
      DescriptionFieldTemplate,
      {
        id: descriptionId4(id),
        description,
        schema,
        uiSchema,
        registry
      }
    ),
    /* @__PURE__ */ jsxs15("label", { children: [
      /* @__PURE__ */ jsx28(
        "input",
        {
          type: "checkbox",
          id,
          name: id,
          checked: typeof value === "undefined" ? false : value,
          required,
          disabled: disabled || readonly,
          autoFocus: autofocus,
          onChange: handleChange,
          onBlur: handleBlur,
          onFocus: handleFocus,
          "aria-describedby": ariaDescribedByIds3(id)
        }
      ),
      labelValue(/* @__PURE__ */ jsx28("span", { children: label }), hideLabel)
    ] })
  ] });
}
var CheckboxWidget_default = CheckboxWidget;

// src/components/widgets/CheckboxesWidget.tsx
import { useCallback as useCallback6 } from "react";
import {
  ariaDescribedByIds as ariaDescribedByIds4,
  enumOptionsDeselectValue,
  enumOptionsIsSelected,
  enumOptionsSelectValue,
  enumOptionsValueForIndex,
  optionId
} from "@rjsf/utils";
import { jsx as jsx29, jsxs as jsxs16 } from "react/jsx-runtime";
function CheckboxesWidget({
  id,
  disabled,
  options: { inline = false, enumOptions, enumDisabled, emptyValue },
  value,
  autofocus = false,
  readonly,
  onChange,
  onBlur,
  onFocus
}) {
  const checkboxesValues = Array.isArray(value) ? value : [value];
  const handleBlur = useCallback6(
    ({ target }) => onBlur(id, enumOptionsValueForIndex(target && target.value, enumOptions, emptyValue)),
    [onBlur, id]
  );
  const handleFocus = useCallback6(
    ({ target }) => onFocus(id, enumOptionsValueForIndex(target && target.value, enumOptions, emptyValue)),
    [onFocus, id]
  );
  return /* @__PURE__ */ jsx29("div", { className: "checkboxes", id, children: Array.isArray(enumOptions) && enumOptions.map((option, index) => {
    const checked = enumOptionsIsSelected(option.value, checkboxesValues);
    const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;
    const disabledCls = disabled || itemDisabled || readonly ? "disabled" : "";
    const handleChange = (event) => {
      if (event.target.checked) {
        onChange(enumOptionsSelectValue(index, checkboxesValues, enumOptions));
      } else {
        onChange(enumOptionsDeselectValue(index, checkboxesValues, enumOptions));
      }
    };
    const checkbox = /* @__PURE__ */ jsxs16("span", { children: [
      /* @__PURE__ */ jsx29(
        "input",
        {
          type: "checkbox",
          id: optionId(id, index),
          name: id,
          checked,
          value: String(index),
          disabled: disabled || itemDisabled || readonly,
          autoFocus: autofocus && index === 0,
          onChange: handleChange,
          onBlur: handleBlur,
          onFocus: handleFocus,
          "aria-describedby": ariaDescribedByIds4(id)
        }
      ),
      /* @__PURE__ */ jsx29("span", { children: option.label })
    ] });
    return inline ? /* @__PURE__ */ jsx29("label", { className: `checkbox-inline ${disabledCls}`, children: checkbox }, index) : /* @__PURE__ */ jsx29("div", { className: `checkbox ${disabledCls}`, children: /* @__PURE__ */ jsx29("label", { children: checkbox }) }, index);
  }) });
}
var CheckboxesWidget_default = CheckboxesWidget;

// src/components/widgets/ColorWidget.tsx
import { getTemplate as getTemplate10 } from "@rjsf/utils";
import { jsx as jsx30 } from "react/jsx-runtime";
function ColorWidget(props) {
  const { disabled, readonly, options, registry } = props;
  const BaseInputTemplate2 = getTemplate10("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx30(BaseInputTemplate2, { type: "color", ...props, disabled: disabled || readonly });
}

// src/components/widgets/DateWidget.tsx
import { useCallback as useCallback7 } from "react";
import { getTemplate as getTemplate11 } from "@rjsf/utils";
import { jsx as jsx31 } from "react/jsx-runtime";
function DateWidget(props) {
  const { onChange, options, registry } = props;
  const BaseInputTemplate2 = getTemplate11("BaseInputTemplate", registry, options);
  const handleChange = useCallback7((value) => onChange(value || void 0), [onChange]);
  return /* @__PURE__ */ jsx31(BaseInputTemplate2, { type: "date", ...props, onChange: handleChange });
}

// src/components/widgets/DateTimeWidget.tsx
import {
  getTemplate as getTemplate12,
  localToUTC,
  utcToLocal
} from "@rjsf/utils";
import { jsx as jsx32 } from "react/jsx-runtime";
function DateTimeWidget(props) {
  const { onChange, value, options, registry } = props;
  const BaseInputTemplate2 = getTemplate12("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx32(
    BaseInputTemplate2,
    {
      type: "datetime-local",
      ...props,
      value: utcToLocal(value),
      onChange: (value2) => onChange(localToUTC(value2))
    }
  );
}

// src/components/widgets/EmailWidget.tsx
import { getTemplate as getTemplate13 } from "@rjsf/utils";
import { jsx as jsx33 } from "react/jsx-runtime";
function EmailWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = getTemplate13("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx33(BaseInputTemplate2, { type: "email", ...props });
}

// src/components/widgets/FileWidget.tsx
import { useCallback as useCallback8, useMemo } from "react";
import {
  dataURItoBlob,
  getTemplate as getTemplate14,
  TranslatableString as TranslatableString12
} from "@rjsf/utils";
import Markdown4 from "markdown-to-jsx";
import { Fragment as Fragment3, jsx as jsx34, jsxs as jsxs17 } from "react/jsx-runtime";
function addNameToDataURL(dataURL, name) {
  if (dataURL === null) {
    return null;
  }
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
}
function processFile(file) {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        resolve({
          dataURL: addNameToDataURL(event.target.result, name),
          name,
          size,
          type
        });
      } else {
        resolve({
          dataURL: null,
          name,
          size,
          type
        });
      }
    };
    reader.readAsDataURL(file);
  });
}
function processFiles(files) {
  return Promise.all(Array.from(files).map(processFile));
}
function FileInfoPreview({
  fileInfo,
  registry
}) {
  const { translateString } = registry;
  const { dataURL, type, name } = fileInfo;
  if (!dataURL) {
    return null;
  }
  if (["image/jpeg", "image/png"].includes(type)) {
    return /* @__PURE__ */ jsx34("img", { src: dataURL, style: { maxWidth: "100%" }, className: "file-preview" });
  }
  return /* @__PURE__ */ jsxs17(Fragment3, { children: [
    " ",
    /* @__PURE__ */ jsx34("a", { download: `preview-${name}`, href: dataURL, className: "file-download", children: translateString(TranslatableString12.PreviewLabel) })
  ] });
}
function FilesInfo({
  filesInfo,
  registry,
  preview,
  onRemove,
  options
}) {
  if (filesInfo.length === 0) {
    return null;
  }
  const { translateString } = registry;
  const { RemoveButton: RemoveButton2 } = getTemplate14("ButtonTemplates", registry, options);
  return /* @__PURE__ */ jsx34("ul", { className: "file-info", children: filesInfo.map((fileInfo, key) => {
    const { name, size, type } = fileInfo;
    const handleRemove = () => onRemove(key);
    return /* @__PURE__ */ jsxs17("li", { children: [
      /* @__PURE__ */ jsx34(Markdown4, { children: translateString(TranslatableString12.FilesInfo, [name, type, String(size)]) }),
      preview && /* @__PURE__ */ jsx34(FileInfoPreview, { fileInfo, registry }),
      /* @__PURE__ */ jsx34(RemoveButton2, { onClick: handleRemove, registry })
    ] }, key);
  }) });
}
function extractFileInfo(dataURLs) {
  return dataURLs.reduce((acc, dataURL) => {
    if (!dataURL) {
      return acc;
    }
    try {
      const { blob, name } = dataURItoBlob(dataURL);
      return [
        ...acc,
        {
          dataURL,
          name,
          size: blob.size,
          type: blob.type
        }
      ];
    } catch (e) {
      return acc;
    }
  }, []);
}
function FileWidget(props) {
  const { disabled, readonly, required, multiple, onChange, value, options, registry } = props;
  const BaseInputTemplate2 = getTemplate14("BaseInputTemplate", registry, options);
  const handleChange = useCallback8(
    (event) => {
      if (!event.target.files) {
        return;
      }
      processFiles(event.target.files).then((filesInfoEvent) => {
        const newValue = filesInfoEvent.map((fileInfo) => fileInfo.dataURL);
        if (multiple) {
          onChange(value.concat(newValue[0]));
        } else {
          onChange(newValue[0]);
        }
      });
    },
    [multiple, value, onChange]
  );
  const filesInfo = useMemo(() => extractFileInfo(Array.isArray(value) ? value : [value]), [value]);
  const rmFile = useCallback8(
    (index) => {
      if (multiple) {
        const newValue = value.filter((_, i) => i !== index);
        onChange(newValue);
      } else {
        onChange(void 0);
      }
    },
    [multiple, value, onChange]
  );
  return /* @__PURE__ */ jsxs17("div", { children: [
    /* @__PURE__ */ jsx34(
      BaseInputTemplate2,
      {
        ...props,
        disabled: disabled || readonly,
        type: "file",
        required: value ? false : required,
        onChangeOverride: handleChange,
        value: "",
        accept: options.accept ? String(options.accept) : void 0
      }
    ),
    /* @__PURE__ */ jsx34(
      FilesInfo,
      {
        filesInfo,
        onRemove: rmFile,
        registry,
        preview: options.filePreview,
        options
      }
    )
  ] });
}
var FileWidget_default = FileWidget;

// src/components/widgets/HiddenWidget.tsx
import { jsx as jsx35 } from "react/jsx-runtime";
function HiddenWidget({
  id,
  value
}) {
  return /* @__PURE__ */ jsx35("input", { type: "hidden", id, name: id, value: typeof value === "undefined" ? "" : value });
}
var HiddenWidget_default = HiddenWidget;

// src/components/widgets/PasswordWidget.tsx
import { getTemplate as getTemplate15 } from "@rjsf/utils";
import { jsx as jsx36 } from "react/jsx-runtime";
function PasswordWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = getTemplate15("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx36(BaseInputTemplate2, { type: "password", ...props });
}

// src/components/widgets/RadioWidget.tsx
import { useCallback as useCallback9 } from "react";
import {
  ariaDescribedByIds as ariaDescribedByIds5,
  enumOptionsIsSelected as enumOptionsIsSelected2,
  enumOptionsValueForIndex as enumOptionsValueForIndex2,
  optionId as optionId2
} from "@rjsf/utils";
import { jsx as jsx37, jsxs as jsxs18 } from "react/jsx-runtime";
function RadioWidget({
  options,
  value,
  required,
  disabled,
  readonly,
  autofocus = false,
  onBlur,
  onFocus,
  onChange,
  id
}) {
  const { enumOptions, enumDisabled, inline, emptyValue } = options;
  const handleBlur = useCallback9(
    ({ target }) => onBlur(id, enumOptionsValueForIndex2(target && target.value, enumOptions, emptyValue)),
    [onBlur, id]
  );
  const handleFocus = useCallback9(
    ({ target }) => onFocus(id, enumOptionsValueForIndex2(target && target.value, enumOptions, emptyValue)),
    [onFocus, id]
  );
  return /* @__PURE__ */ jsx37("div", { className: "field-radio-group", id, children: Array.isArray(enumOptions) && enumOptions.map((option, i) => {
    const checked = enumOptionsIsSelected2(option.value, value);
    const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;
    const disabledCls = disabled || itemDisabled || readonly ? "disabled" : "";
    const handleChange = () => onChange(option.value);
    const radio = /* @__PURE__ */ jsxs18("span", { children: [
      /* @__PURE__ */ jsx37(
        "input",
        {
          type: "radio",
          id: optionId2(id, i),
          checked,
          name: id,
          required,
          value: String(i),
          disabled: disabled || itemDisabled || readonly,
          autoFocus: autofocus && i === 0,
          onChange: handleChange,
          onBlur: handleBlur,
          onFocus: handleFocus,
          "aria-describedby": ariaDescribedByIds5(id)
        }
      ),
      /* @__PURE__ */ jsx37("span", { children: option.label })
    ] });
    return inline ? /* @__PURE__ */ jsx37("label", { className: `radio-inline ${disabledCls}`, children: radio }, i) : /* @__PURE__ */ jsx37("div", { className: `radio ${disabledCls}`, children: /* @__PURE__ */ jsx37("label", { children: radio }) }, i);
  }) });
}
var RadioWidget_default = RadioWidget;

// src/components/widgets/RangeWidget.tsx
import { jsx as jsx38, jsxs as jsxs19 } from "react/jsx-runtime";
function RangeWidget(props) {
  const {
    value,
    registry: {
      templates: { BaseInputTemplate: BaseInputTemplate2 }
    }
  } = props;
  return /* @__PURE__ */ jsxs19("div", { className: "field-range-wrapper", children: [
    /* @__PURE__ */ jsx38(BaseInputTemplate2, { type: "range", ...props }),
    /* @__PURE__ */ jsx38("span", { className: "range-view", children: value })
  ] });
}

// src/components/widgets/SelectWidget.tsx
import { useCallback as useCallback10 } from "react";
import {
  ariaDescribedByIds as ariaDescribedByIds6,
  enumOptionsIndexForValue,
  enumOptionsValueForIndex as enumOptionsValueForIndex3
} from "@rjsf/utils";
import { jsx as jsx39, jsxs as jsxs20 } from "react/jsx-runtime";
function getValue(event, multiple) {
  if (multiple) {
    return Array.from(event.target.options).slice().filter((o) => o.selected).map((o) => o.value);
  }
  return event.target.value;
}
function SelectWidget({
  schema,
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  multiple = false,
  autofocus = false,
  onChange,
  onBlur,
  onFocus,
  placeholder
}) {
  const { enumOptions, enumDisabled, emptyValue: optEmptyVal } = options;
  const emptyValue = multiple ? [] : "";
  const handleFocus = useCallback10(
    (event) => {
      const newValue = getValue(event, multiple);
      return onFocus(id, enumOptionsValueForIndex3(newValue, enumOptions, optEmptyVal));
    },
    [onFocus, id, schema, multiple, enumOptions, optEmptyVal]
  );
  const handleBlur = useCallback10(
    (event) => {
      const newValue = getValue(event, multiple);
      return onBlur(id, enumOptionsValueForIndex3(newValue, enumOptions, optEmptyVal));
    },
    [onBlur, id, schema, multiple, enumOptions, optEmptyVal]
  );
  const handleChange = useCallback10(
    (event) => {
      const newValue = getValue(event, multiple);
      return onChange(enumOptionsValueForIndex3(newValue, enumOptions, optEmptyVal));
    },
    [onChange, schema, multiple, enumOptions, optEmptyVal]
  );
  const selectedIndexes = enumOptionsIndexForValue(value, enumOptions, multiple);
  const showPlaceholderOption = !multiple && schema.default === void 0;
  return /* @__PURE__ */ jsxs20(
    "select",
    {
      id,
      name: id,
      multiple,
      className: "form-control",
      value: typeof selectedIndexes === "undefined" ? emptyValue : selectedIndexes,
      required,
      disabled: disabled || readonly,
      autoFocus: autofocus,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onChange: handleChange,
      "aria-describedby": ariaDescribedByIds6(id),
      children: [
        showPlaceholderOption && /* @__PURE__ */ jsx39("option", { value: "", children: placeholder }),
        Array.isArray(enumOptions) && enumOptions.map(({ value: value2, label }, i) => {
          const disabled2 = enumDisabled && enumDisabled.indexOf(value2) !== -1;
          return /* @__PURE__ */ jsx39("option", { value: String(i), disabled: disabled2, children: label }, i);
        })
      ]
    }
  );
}
var SelectWidget_default = SelectWidget;

// src/components/widgets/TextareaWidget.tsx
import { useCallback as useCallback11 } from "react";
import { ariaDescribedByIds as ariaDescribedByIds7 } from "@rjsf/utils";
import { jsx as jsx40 } from "react/jsx-runtime";
function TextareaWidget({
  id,
  options = {},
  placeholder,
  value,
  required,
  disabled,
  readonly,
  autofocus = false,
  onChange,
  onBlur,
  onFocus
}) {
  const handleChange = useCallback11(
    ({ target: { value: value2 } }) => onChange(value2 === "" ? options.emptyValue : value2),
    [onChange, options.emptyValue]
  );
  const handleBlur = useCallback11(
    ({ target }) => onBlur(id, target && target.value),
    [onBlur, id]
  );
  const handleFocus = useCallback11(
    ({ target }) => onFocus(id, target && target.value),
    [id, onFocus]
  );
  return /* @__PURE__ */ jsx40(
    "textarea",
    {
      id,
      name: id,
      className: "form-control",
      value: value ? value : "",
      placeholder,
      required,
      disabled,
      readOnly: readonly,
      autoFocus: autofocus,
      rows: options.rows,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onChange: handleChange,
      "aria-describedby": ariaDescribedByIds7(id)
    }
  );
}
TextareaWidget.defaultProps = {
  autofocus: false,
  options: {}
};
var TextareaWidget_default = TextareaWidget;

// src/components/widgets/TextWidget.tsx
import { getTemplate as getTemplate16 } from "@rjsf/utils";
import { jsx as jsx41 } from "react/jsx-runtime";
function TextWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = getTemplate16("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx41(BaseInputTemplate2, { ...props });
}

// src/components/widgets/TimeWidget.tsx
import { useCallback as useCallback12 } from "react";
import { getTemplate as getTemplate17 } from "@rjsf/utils";
import { jsx as jsx42 } from "react/jsx-runtime";
function TimeWidget(props) {
  const { onChange, options, registry } = props;
  const BaseInputTemplate2 = getTemplate17("BaseInputTemplate", registry, options);
  const handleChange = useCallback12((value) => onChange(value ? `${value}:00` : void 0), [onChange]);
  return /* @__PURE__ */ jsx42(BaseInputTemplate2, { type: "time", ...props, onChange: handleChange });
}

// src/components/widgets/URLWidget.tsx
import { getTemplate as getTemplate18 } from "@rjsf/utils";
import { jsx as jsx43 } from "react/jsx-runtime";
function URLWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = getTemplate18("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx43(BaseInputTemplate2, { type: "url", ...props });
}

// src/components/widgets/UpDownWidget.tsx
import { getTemplate as getTemplate19 } from "@rjsf/utils";
import { jsx as jsx44 } from "react/jsx-runtime";
function UpDownWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = getTemplate19("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ jsx44(BaseInputTemplate2, { type: "number", ...props });
}

// src/components/widgets/index.ts
function widgets() {
  return {
    AltDateWidget: AltDateWidget_default,
    AltDateTimeWidget: AltDateTimeWidget_default,
    CheckboxWidget: CheckboxWidget_default,
    CheckboxesWidget: CheckboxesWidget_default,
    ColorWidget,
    DateWidget,
    DateTimeWidget,
    EmailWidget,
    FileWidget: FileWidget_default,
    HiddenWidget: HiddenWidget_default,
    PasswordWidget,
    RadioWidget: RadioWidget_default,
    RangeWidget,
    SelectWidget: SelectWidget_default,
    TextWidget,
    TextareaWidget: TextareaWidget_default,
    TimeWidget,
    UpDownWidget,
    URLWidget
  };
}
var widgets_default = widgets;

// src/getDefaultRegistry.ts
function getDefaultRegistry() {
  return {
    fields: fields_default(),
    templates: templates_default(),
    widgets: widgets_default(),
    rootSchema: {},
    formContext: {},
    translateString: englishStringTranslator
  };
}

// src/components/Form.tsx
import { jsx as jsx45, jsxs as jsxs21 } from "react/jsx-runtime";
var Form = class extends Component5 {
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
    this.getUsedFormData = (formData, fields2) => {
      if (fields2.length === 0 && typeof formData !== "object") {
        return formData;
      }
      const data = _pick(formData, fields2);
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
          if (typeof _obj[key] === "object") {
            const newPaths = paths.map((path) => [...path, key]);
            if (_obj[key][RJSF_ADDITIONAL_PROPERTIES_FLAG] && _obj[key][NAME_KEY] !== "") {
              acc.push(_obj[key][NAME_KEY]);
            } else {
              getAllPaths(_obj[key], acc, newPaths);
            }
          } else if (key === NAME_KEY && _obj[key] !== "") {
            paths.forEach((path) => {
              const formValue = _get(formData, path);
              if (typeof formValue !== "object" || _isEmpty(formValue) || Array.isArray(formValue) && formValue.every((val) => typeof val !== "object")) {
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
      const pathSchema = schemaUtils.toPathSchema(retrievedSchema, "", formData);
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
      if (isObject5(formData) || Array.isArray(formData)) {
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
          formData: newFormData
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
        if (newErrorSchema) {
          const filteredErrors = this.filterErrorsBasedOnSchema(newErrorSchema, retrievedSchema, newFormData);
          errorSchema = mergeObjects2(errorSchema, filteredErrors, "preventDuplicates");
        }
        state = {
          formData: newFormData,
          errors,
          errorSchema,
          schemaValidationErrors,
          schemaValidationErrorSchema
        };
      } else if (!noValidate && newErrorSchema) {
        const errorSchema = extraErrors ? mergeObjects2(newErrorSchema, extraErrors, "preventDuplicates") : newErrorSchema;
        state = {
          formData: newFormData,
          errorSchema,
          errors: toErrorList(errorSchema)
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
      const newState = this.getStateFromProps(this.props, void 0);
      const newFormData = newState.formData;
      const state = {
        formData: newFormData,
        errorSchema: {},
        errors: [],
        schemaValidationErrors: [],
        schemaValidationErrorSchema: {}
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
        const errorSchema = extraErrors || {};
        const errors = extraErrors ? toErrorList(extraErrors) : [];
        this.setState(
          {
            formData: newFormData,
            errors,
            errorSchema,
            schemaValidationErrors: [],
            schemaValidationErrorSchema: {}
          },
          () => {
            if (onSubmit) {
              onSubmit({ ...this.state, formData: newFormData, status: "submitted" }, event);
            }
          }
        );
      }
    };
    /** Provides a function that can be used to programmatically submit the `Form` */
    this.submit = () => {
      if (this.formElement.current) {
        const submitCustomEvent = new CustomEvent("submit", {
          cancelable: true
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
      const hasError = errors.length > 0 || extraErrors && extraErrorsBlockSubmit;
      if (hasError) {
        if (extraErrors) {
          const merged = validationDataMerge(schemaValidation, extraErrors);
          errorSchema = merged.errorSchema;
          errors = merged.errors;
        }
        if (focusOnFirstError) {
          if (typeof focusOnFirstError === "function") {
            focusOnFirstError(errors[0]);
          } else {
            this.focusOnError(errors[0]);
          }
        }
        this.setState(
          {
            errors,
            errorSchema,
            schemaValidationErrors,
            schemaValidationErrorSchema
          },
          () => {
            if (onError) {
              onError(errors);
            } else {
              console.error("Form validation failed", errors);
            }
          }
        );
      } else if (prevErrors.length > 0) {
        this.setState({
          errors: [],
          errorSchema: {},
          schemaValidationErrors: [],
          schemaValidationErrorSchema: {}
        });
      }
      return !hasError;
    };
    if (!props.validator) {
      throw new Error("A validator is required for Form functionality to work");
    }
    this.state = this.getStateFromProps(props, props.formData);
    if (this.props.onChange && !deepEquals3(this.state.formData, this.props.formData)) {
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
    if (!deepEquals3(this.props, prevProps)) {
      const isSchemaChanged = !deepEquals3(prevProps.schema, this.props.schema);
      const isFormDataChanged = !deepEquals3(prevProps.formData, this.props.formData);
      const nextState = this.getStateFromProps(
        this.props,
        this.props.formData,
        // If the `schema` has changed, we need to update the retrieved schema.
        // Or if the `formData` changes, for example in the case of a schema with dependencies that need to
        //  match one of the subSchemas, the retrieved schema must be updated.
        isSchemaChanged || isFormDataChanged ? void 0 : this.state.retrievedSchema,
        isSchemaChanged
      );
      const shouldUpdate = !deepEquals3(nextState, prevState);
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
      if (!deepEquals3(nextState.formData, this.props.formData) && !deepEquals3(nextState.formData, prevState.formData) && this.props.onChange) {
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
    const state = this.state || {};
    const schema = "schema" in props ? props.schema : this.props.schema;
    const uiSchema = ("uiSchema" in props ? props.uiSchema : this.props.uiSchema) || {};
    const edit = typeof inputFormData !== "undefined";
    const liveValidate = "liveValidate" in props ? props.liveValidate : this.props.liveValidate;
    const mustValidate = edit && !props.noValidate && liveValidate;
    const rootSchema = schema;
    const experimental_defaultFormStateBehavior = "experimental_defaultFormStateBehavior" in props ? props.experimental_defaultFormStateBehavior : this.props.experimental_defaultFormStateBehavior;
    let schemaUtils = state.schemaUtils;
    if (!schemaUtils || schemaUtils.doesSchemaUtilsDiffer(props.validator, rootSchema, experimental_defaultFormStateBehavior)) {
      schemaUtils = createSchemaUtils(props.validator, rootSchema, experimental_defaultFormStateBehavior);
    }
    const formData = schemaUtils.getDefaultFormState(schema, inputFormData);
    const _retrievedSchema = retrievedSchema ?? schemaUtils.retrieveSchema(schema, formData);
    const getCurrentErrors = () => {
      if (props.noValidate || isSchemaChanged) {
        return { errors: [], errorSchema: {} };
      } else if (!props.liveValidate) {
        return {
          errors: state.schemaValidationErrors || [],
          errorSchema: state.schemaValidationErrorSchema || {}
        };
      }
      return {
        errors: state.errors || [],
        errorSchema: state.errorSchema || {}
      };
    };
    let errors;
    let errorSchema;
    let schemaValidationErrors = state.schemaValidationErrors;
    let schemaValidationErrorSchema = state.schemaValidationErrorSchema;
    if (mustValidate) {
      const schemaValidation = this.validate(formData, schema, schemaUtils, _retrievedSchema);
      errors = schemaValidation.errors;
      if (isSchemaChanged) {
        errorSchema = schemaValidation.errorSchema;
      } else {
        errorSchema = mergeObjects2(
          this.state?.errorSchema,
          schemaValidation.errorSchema,
          "preventDuplicates"
        );
      }
      schemaValidationErrors = errors;
      schemaValidationErrorSchema = errorSchema;
    } else {
      const currentErrors = getCurrentErrors();
      errors = currentErrors.errors;
      errorSchema = currentErrors.errorSchema;
    }
    if (props.extraErrors) {
      const merged = validationDataMerge({ errorSchema, errors }, props.extraErrors);
      errorSchema = merged.errorSchema;
      errors = merged.errors;
    }
    const idSchema = schemaUtils.toIdSchema(
      _retrievedSchema,
      uiSchema["ui:rootFieldId"],
      formData,
      props.idPrefix,
      props.idSeparator
    );
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
      retrievedSchema: _retrievedSchema
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
    const resolvedSchema = retrievedSchema ?? schemaUtils.retrieveSchema(schema, formData);
    return schemaUtils.getValidator().validateFormData(formData, resolvedSchema, customValidate, transformErrors, uiSchema);
  }
  /** Renders any errors contained in the `state` in using the `ErrorList`, if not disabled by `showErrorList`. */
  renderErrors(registry) {
    const { errors, errorSchema, schema, uiSchema } = this.state;
    const { formContext } = this.props;
    const options = getUiOptions12(uiSchema);
    const ErrorListTemplate = getTemplate20("ErrorListTemplate", registry, options);
    if (errors && errors.length) {
      return /* @__PURE__ */ jsx45(
        ErrorListTemplate,
        {
          errors,
          errorSchema: errorSchema || {},
          schema,
          uiSchema,
          formContext,
          registry
        }
      );
    }
    return null;
  }
  // Filtering errors based on your retrieved schema to only show errors for properties in the selected branch.
  filterErrorsBasedOnSchema(schemaErrors, resolvedSchema, formData) {
    const { retrievedSchema, schemaUtils } = this.state;
    const _retrievedSchema = resolvedSchema ?? retrievedSchema;
    const pathSchema = schemaUtils.toPathSchema(_retrievedSchema, "", formData);
    const fieldNames = this.getFieldNames(pathSchema, formData);
    const filteredErrors = _pick(schemaErrors, fieldNames);
    if (resolvedSchema?.type !== "object" && resolvedSchema?.type !== "array") {
      filteredErrors.__errors = schemaErrors.__errors;
    }
    const filterUndefinedErrors = (errors) => {
      _forEach(errors, (errorAtKey, errorKey) => {
        if (errorAtKey === void 0) {
          delete errors[errorKey];
        } else if (typeof errorAtKey === "object" && !Array.isArray(errorAtKey.__errors)) {
          filterUndefinedErrors(errorAtKey);
        }
      });
      return errors;
    };
    return filterUndefinedErrors(filteredErrors);
  }
  /** Returns the registry for the form */
  getRegistry() {
    const { translateString: customTranslateString, uiSchema = {} } = this.props;
    const { schemaUtils } = this.state;
    const { fields: fields2, templates: templates2, widgets: widgets2, formContext, translateString } = getDefaultRegistry();
    return {
      fields: { ...fields2, ...this.props.fields },
      templates: {
        ...templates2,
        ...this.props.templates,
        ButtonTemplates: {
          ...templates2.ButtonTemplates,
          ...this.props.templates?.ButtonTemplates
        }
      },
      widgets: { ...widgets2, ...this.props.widgets },
      rootSchema: this.props.schema,
      formContext: this.props.formContext || formContext,
      schemaUtils,
      translateString: customTranslateString || translateString,
      globalUiOptions: uiSchema[UI_GLOBAL_OPTIONS_KEY]
    };
  }
  /** Attempts to focus on the field associated with the `error`. Uses the `property` field to compute path of the error
   * field, then, using the `idPrefix` and `idSeparator` converts that path into an id. Then the input element with that
   * id is attempted to be found using the `formElement` ref. If it is located, then it is focused.
   *
   * @param error - The error on which to focus
   */
  focusOnError(error) {
    const { idPrefix = "root", idSeparator = "_" } = this.props;
    const { property } = error;
    const path = _toPath(property);
    if (path[0] === "") {
      path[0] = idPrefix;
    } else {
      path.unshift(idPrefix);
    }
    const elementId = path.join(idSeparator);
    let field = this.formElement.current.elements[elementId];
    if (!field) {
      field = this.formElement.current.querySelector(`input[id^=${elementId}`);
    }
    if (field && field.length) {
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
    const {
      children,
      id,
      idPrefix,
      idSeparator,
      className = "",
      tagName,
      name,
      method,
      target,
      action,
      autoComplete,
      enctype,
      acceptcharset,
      acceptCharset,
      noHtml5Validate = false,
      disabled,
      readonly,
      formContext,
      showErrorList = "top",
      _internalFormWrapper
    } = this.props;
    const { schema, uiSchema, formData, errorSchema, idSchema } = this.state;
    const registry = this.getRegistry();
    const { SchemaField: _SchemaField } = registry.fields;
    const { SubmitButton: SubmitButton2 } = registry.templates.ButtonTemplates;
    const as = _internalFormWrapper ? tagName : void 0;
    const FormTag = _internalFormWrapper || tagName || "form";
    let { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions = {} } = getUiOptions12(uiSchema);
    if (disabled) {
      submitOptions = { ...submitOptions, props: { ...submitOptions.props, disabled: true } };
    }
    const submitUiSchema = { [UI_OPTIONS_KEY2]: { [SUBMIT_BTN_OPTIONS_KEY]: submitOptions } };
    return /* @__PURE__ */ jsxs21(
      FormTag,
      {
        className: className ? className : "rjsf",
        id,
        name,
        method,
        target,
        action,
        autoComplete,
        encType: enctype,
        acceptCharset: acceptCharset || acceptcharset,
        noValidate: noHtml5Validate,
        onSubmit: this.onSubmit,
        as,
        ref: this.formElement,
        children: [
          showErrorList === "top" && this.renderErrors(registry),
          /* @__PURE__ */ jsx45(
            _SchemaField,
            {
              name: "",
              schema,
              uiSchema,
              errorSchema,
              idSchema,
              idPrefix,
              idSeparator,
              formContext,
              formData,
              onChange: this.onChange,
              onBlur: this.onBlur,
              onFocus: this.onFocus,
              registry,
              disabled,
              readonly
            }
          ),
          children ? children : /* @__PURE__ */ jsx45(SubmitButton2, { uiSchema: submitUiSchema, registry }),
          showErrorList === "bottom" && this.renderErrors(registry)
        ]
      }
    );
  }
};

// src/withTheme.tsx
import { forwardRef } from "react";
import { jsx as jsx46 } from "react/jsx-runtime";
function withTheme(themeProps) {
  return forwardRef(
    ({ fields: fields2, widgets: widgets2, templates: templates2, ...directProps }, ref) => {
      fields2 = { ...themeProps?.fields, ...fields2 };
      widgets2 = { ...themeProps?.widgets, ...widgets2 };
      templates2 = {
        ...themeProps?.templates,
        ...templates2,
        ButtonTemplates: {
          ...themeProps?.templates?.ButtonTemplates,
          ...templates2?.ButtonTemplates
        }
      };
      return /* @__PURE__ */ jsx46(
        Form,
        {
          ...themeProps,
          ...directProps,
          fields: fields2,
          widgets: widgets2,
          templates: templates2,
          ref
        }
      );
    }
  );
}

// src/index.ts
var src_default = Form;
export {
  src_default as default,
  getDefaultRegistry,
  withTheme
};
//# sourceMappingURL=index.esm.js.map
