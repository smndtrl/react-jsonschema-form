"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  getDefaultRegistry: () => getDefaultRegistry,
  withTheme: () => withTheme
});
module.exports = __toCommonJS(src_exports);

// src/components/Form.tsx
var import_react17 = require("react");
var import_utils39 = require("@rjsf/utils");
var import_forEach = __toESM(require("lodash/forEach"));
var import_get4 = __toESM(require("lodash/get"));
var import_isEmpty2 = __toESM(require("lodash/isEmpty"));
var import_pick = __toESM(require("lodash/pick"));
var import_toPath = __toESM(require("lodash/toPath"));

// src/getDefaultRegistry.ts
var import_utils38 = require("@rjsf/utils");

// src/components/fields/ArrayField.tsx
var import_react = require("react");
var import_utils = require("@rjsf/utils");
var import_cloneDeep = __toESM(require("lodash/cloneDeep"));
var import_get = __toESM(require("lodash/get"));
var import_isObject = __toESM(require("lodash/isObject"));
var import_set = __toESM(require("lodash/set"));
var import_nanoid = require("nanoid");
var import_jsx_runtime = require("react/jsx-runtime");
function generateRowId() {
  return (0, import_nanoid.nanoid)();
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
var ArrayField = class extends import_react.Component {
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
      if ((0, import_utils.isFixedItems)(schema) && (0, import_utils.allowAdditionalItems)(schema)) {
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
              (0, import_set.default)(newErrorSchema, [i], errorSchema[idx]);
            } else if (i > index) {
              (0, import_set.default)(newErrorSchema, [i + 1], errorSchema[idx]);
            }
          }
        }
        const newKeyedFormDataRow = {
          key: generateRowId(),
          item: (0, import_cloneDeep.default)(keyedFormData[index].item)
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
              (0, import_set.default)(newErrorSchema, [i], errorSchema[idx]);
            } else if (i > index) {
              (0, import_set.default)(newErrorSchema, [i - 1], errorSchema[idx]);
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
              (0, import_set.default)(newErrorSchema, [newIndex], errorSchema[index]);
            } else if (i == newIndex) {
              (0, import_set.default)(newErrorSchema, [index], errorSchema[newIndex]);
            } else {
              (0, import_set.default)(newErrorSchema, [idx], errorSchema[i]);
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
    return (0, import_get.default)(
      schema,
      [import_utils.ITEMS_KEY, "title"],
      (0, import_get.default)(schema, [import_utils.ITEMS_KEY, "description"], translateString(import_utils.TranslatableString.ArrayItemTitle))
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
    let { addable } = (0, import_utils.getUiOptions)(uiSchema, registry.globalUiOptions);
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
          (0, import_set.default)(newErrorSchema, [i], errorSchema[idx]);
        } else if (i >= index) {
          (0, import_set.default)(newErrorSchema, [i + 1], errorSchema[idx]);
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
    if (!(import_utils.ITEMS_KEY in schema)) {
      const uiOptions = (0, import_utils.getUiOptions)(uiSchema);
      const UnsupportedFieldTemplate = (0, import_utils.getTemplate)(
        "UnsupportedFieldTemplate",
        registry,
        uiOptions
      );
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        UnsupportedFieldTemplate,
        {
          schema,
          idSchema,
          reason: translateString(import_utils.TranslatableString.MissingItems),
          registry
        }
      );
    }
    if (schemaUtils.isMultiSelect(schema)) {
      return this.renderMultiSelect();
    }
    if ((0, import_utils.isCustomWidget)(uiSchema)) {
      return this.renderCustomWidget();
    }
    if ((0, import_utils.isFixedItems)(schema)) {
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
    const uiOptions = (0, import_utils.getUiOptions)(uiSchema);
    const _schemaItems = (0, import_isObject.default)(schema.items) ? schema.items : {};
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
    const Template = (0, import_utils.getTemplate)("ArrayFieldTemplate", registry, uiOptions);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Template, { ...arrayProps });
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
    const { widget, title: uiTitle, ...options } = (0, import_utils.getUiOptions)(uiSchema, globalUiOptions);
    const Widget = (0, import_utils.getWidget)(schema, widget, widgets2);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    const enumOptions = (0, import_utils.optionsList)(itemsSchema, uiSchema);
    const { widget = "select", title: uiTitle, ...options } = (0, import_utils.getUiOptions)(uiSchema, globalUiOptions);
    const Widget = (0, import_utils.getWidget)(schema, widget, widgets2);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    const { widget = "files", title: uiTitle, ...options } = (0, import_utils.getUiOptions)(uiSchema, globalUiOptions);
    const Widget = (0, import_utils.getWidget)(schema, widget, widgets2);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
    const uiOptions = (0, import_utils.getUiOptions)(uiSchema);
    const { schemaUtils, formContext } = registry;
    const _schemaItems = (0, import_isObject.default)(schema.items) ? schema.items : [];
    const itemSchemas = _schemaItems.map(
      (item, index) => schemaUtils.retrieveSchema(item, formData[index])
    );
    const additionalSchema = (0, import_isObject.default)(schema.additionalItems) ? schemaUtils.retrieveSchema(schema.additionalItems, formData) : null;
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
        const itemSchema = (additional && (0, import_isObject.default)(schema.additionalItems) ? schemaUtils.retrieveSchema(schema.additionalItems, itemCast) : itemSchemas[index]) || {};
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
    const Template = (0, import_utils.getTemplate)("ArrayFieldTemplate", registry, uiOptions);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Template, { ...arrayProps });
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
    const { orderable = true, removable = true, copyable = false } = (0, import_utils.getUiOptions)(uiSchema, globalUiOptions);
    const has2 = {
      moveUp: orderable && canMoveUp,
      moveDown: orderable && canMoveDown,
      copy: copyable && canAdd,
      remove: removable && canRemove,
      toolbar: false
    };
    has2.toolbar = Object.keys(has2).some((key2) => has2[key2]);
    return {
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_utils2 = require("@rjsf/utils");
var import_isObject2 = __toESM(require("lodash/isObject"));
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  } = (0, import_utils2.getUiOptions)(uiSchema, globalUiOptions);
  const Widget = (0, import_utils2.getWidget)(schema, widget, widgets2);
  const yes = translateString(import_utils2.TranslatableString.YesLabel);
  const no = translateString(import_utils2.TranslatableString.NoLabel);
  let enumOptions;
  const label = uiTitle ?? schemaTitle ?? title ?? name;
  if (Array.isArray(schema.oneOf)) {
    enumOptions = (0, import_utils2.optionsList)(
      {
        oneOf: schema.oneOf.map((option) => {
          if ((0, import_isObject2.default)(option)) {
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
      enumOptions = (0, import_utils2.optionsList)(
        {
          enum: enums,
          // NOTE: enumNames is deprecated, but still supported for now.
          enumNames: schemaWithEnumNames.enumNames
        },
        uiSchema
      );
    }
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_react2 = require("react");
var import_get2 = __toESM(require("lodash/get"));
var import_isEmpty = __toESM(require("lodash/isEmpty"));
var import_omit = __toESM(require("lodash/omit"));
var import_utils3 = require("@rjsf/utils");
var import_jsx_runtime3 = require("react/jsx-runtime");
var AnyOfField = class extends import_react2.Component {
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
    if (!(0, import_utils3.deepEquals)(prevProps.options, options)) {
      const {
        registry: { schemaUtils }
      } = this.props;
      const retrievedOptions = options.map((opt) => schemaUtils.retrieveSchema(opt, formData));
      newState = { selectedOption, retrievedOptions };
    }
    if (!(0, import_utils3.deepEquals)(formData, prevProps.formData) && idSchema.$id === prevProps.idSchema.$id) {
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
    const discriminator = (0, import_utils3.getDiscriminatorFieldFromSchema)(schema);
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
    } = (0, import_utils3.getUiOptions)(uiSchema, globalUiOptions);
    const Widget = (0, import_utils3.getWidget)({ type: "number" }, widget, widgets2);
    const rawErrors = (0, import_get2.default)(errorSchema, import_utils3.ERRORS_KEY, []);
    const fieldErrorSchema = (0, import_omit.default)(errorSchema, [import_utils3.ERRORS_KEY]);
    const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
    const option = selectedOption >= 0 ? retrievedOptions[selectedOption] || null : null;
    let optionSchema;
    if (option) {
      const { required } = schema;
      optionSchema = required ? (0, import_utils3.mergeSchemas)({ required }, option) : option;
    }
    let optionsUiSchema = [];
    if (import_utils3.ONE_OF_KEY in schema && uiSchema && import_utils3.ONE_OF_KEY in uiSchema) {
      if (Array.isArray(uiSchema[import_utils3.ONE_OF_KEY])) {
        optionsUiSchema = uiSchema[import_utils3.ONE_OF_KEY];
      } else {
        console.warn(`uiSchema.oneOf is not an array for "${title || name}"`);
      }
    } else if (import_utils3.ANY_OF_KEY in schema && uiSchema && import_utils3.ANY_OF_KEY in uiSchema) {
      if (Array.isArray(uiSchema[import_utils3.ANY_OF_KEY])) {
        optionsUiSchema = uiSchema[import_utils3.ANY_OF_KEY];
      } else {
        console.warn(`uiSchema.anyOf is not an array for "${title || name}"`);
      }
    }
    let optionUiSchema = uiSchema;
    if (selectedOption >= 0 && optionsUiSchema.length > selectedOption) {
      optionUiSchema = optionsUiSchema[selectedOption];
    }
    const translateEnum = title ? import_utils3.TranslatableString.TitleOptionPrefix : import_utils3.TranslatableString.OptionPrefix;
    const translateParams = title ? [title] : [];
    const enumOptions = retrievedOptions.map((opt, index) => {
      const { title: uiTitle = opt.title } = (0, import_utils3.getUiOptions)(optionsUiSchema[index]);
      return {
        label: uiTitle || translateString(translateEnum, translateParams.concat(String(index + 1))),
        value: index
      };
    });
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "panel panel-default panel-body", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "form-group", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Widget,
        {
          id: this.getFieldId(),
          name: `${name}${schema.oneOf ? "__oneof_select" : "__anyof_select"}`,
          schema: { type: "number", default: 0 },
          onChange: this.onOptionChange,
          onBlur,
          onFocus,
          disabled: disabled || (0, import_isEmpty.default)(enumOptions),
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
      optionSchema && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(_SchemaField, { ...this.props, schema: optionSchema, uiSchema: optionUiSchema })
    ] });
  }
};
var MultiSchemaField_default = AnyOfField;

// src/components/fields/NumberField.tsx
var import_react3 = require("react");
var import_utils4 = require("@rjsf/utils");
var import_jsx_runtime4 = require("react/jsx-runtime");
var trailingCharMatcherWithPrefix = /\.([0-9]*0)*$/;
var trailingCharMatcher = /[0.]0*$/;
function NumberField(props) {
  const { registry, onChange, formData, value: initialValue } = props;
  const [lastValue, setLastValue] = (0, import_react3.useState)(initialValue);
  const { StringField: StringField2 } = registry.fields;
  let value = formData;
  const handleChange = (0, import_react3.useCallback)(
    (value2) => {
      setLastValue(value2);
      if (`${value2}`.charAt(0) === ".") {
        value2 = `0${value2}`;
      }
      const processed = typeof value2 === "string" && value2.match(trailingCharMatcherWithPrefix) ? (0, import_utils4.asNumber)(value2.replace(trailingCharMatcher, "")) : (0, import_utils4.asNumber)(value2);
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(StringField2, { ...props, formData: value, onChange: handleChange });
}
var NumberField_default = NumberField;

// src/components/fields/ObjectField.tsx
var import_react4 = require("react");
var import_utils5 = require("@rjsf/utils");
var import_markdown_to_jsx = __toESM(require("markdown-to-jsx"));
var import_get3 = __toESM(require("lodash/get"));
var import_has = __toESM(require("lodash/has"));
var import_isObject3 = __toESM(require("lodash/isObject"));
var import_set2 = __toESM(require("lodash/set"));
var import_unset = __toESM(require("lodash/unset"));
var import_jsx_runtime5 = require("react/jsx-runtime");
var ObjectField = class extends import_react4.Component {
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
        (0, import_unset.default)(copiedFormData, key);
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
      const { duplicateKeySuffixSeparator = "-" } = (0, import_utils5.getUiOptions)(uiSchema, registry.globalUiOptions);
      let index = 0;
      let newKey = preferredKey;
      while ((0, import_has.default)(formData, newKey)) {
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
      if ((0, import_isObject3.default)(schema.additionalProperties)) {
        type = schema.additionalProperties.type;
        defaultValue = schema.additionalProperties.default;
        let apSchema = schema.additionalProperties;
        if (import_utils5.REF_KEY in apSchema) {
          const { schemaUtils } = registry;
          apSchema = schemaUtils.retrieveSchema({ $ref: apSchema[import_utils5.REF_KEY] }, formData);
          type = apSchema.type;
          defaultValue = apSchema.default;
        }
        if (!type && (import_utils5.ANY_OF_KEY in apSchema || import_utils5.ONE_OF_KEY in apSchema)) {
          type = "object";
        }
      }
      const newKey = this.getAvailableKey("newKey", newFormData);
      (0, import_set2.default)(newFormData, newKey, defaultValue ?? this.getDefaultValue(type));
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
        return translateString(import_utils5.TranslatableString.NewStringDefault);
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
    const uiOptions = (0, import_utils5.getUiOptions)(uiSchema, globalUiOptions);
    const { properties: schemaProperties = {} } = schema;
    const templateTitle = uiOptions.title ?? schema.title ?? title ?? name;
    const description = uiOptions.description ?? schema.description;
    let orderedProperties;
    try {
      const properties = Object.keys(schemaProperties);
      orderedProperties = (0, import_utils5.orderProperties)(properties, uiOptions.order);
    } catch (err) {
      return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "config-error", style: { color: "red" }, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_markdown_to_jsx.default, { options: { disableParsingRawHTML: true }, children: translateString(import_utils5.TranslatableString.InvalidObjectField, [name || "root", err.message]) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("pre", { children: JSON.stringify(schema) })
      ] });
    }
    const Template = (0, import_utils5.getTemplate)("ObjectFieldTemplate", registry, uiOptions);
    const templateProps = {
      // getDisplayLabel() always returns false for object types, so just check the `uiOptions.label`
      title: uiOptions.label === false ? "" : templateTitle,
      description: uiOptions.label === false ? void 0 : description,
      properties: orderedProperties.map((name2) => {
        const addedByAdditionalProperties = (0, import_has.default)(schema, [import_utils5.PROPERTIES_KEY, name2, import_utils5.ADDITIONAL_PROPERTY_FLAG]);
        const fieldUiSchema = addedByAdditionalProperties ? uiSchema.additionalProperties : uiSchema[name2];
        const hidden = (0, import_utils5.getUiOptions)(fieldUiSchema).widget === "hidden";
        const fieldIdSchema = (0, import_get3.default)(idSchema, [name2], {});
        return {
          content: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            SchemaField2,
            {
              name: name2,
              required: this.isRequired(name2),
              schema: (0, import_get3.default)(schema, [import_utils5.PROPERTIES_KEY, name2], {}),
              uiSchema: fieldUiSchema,
              errorSchema: (0, import_get3.default)(errorSchema, name2),
              idSchema: fieldIdSchema,
              idPrefix,
              idSeparator,
              formData: (0, import_get3.default)(formData, name2),
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
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Template, { ...templateProps, onAddClick: this.handleAddClick });
  }
};
var ObjectField_default = ObjectField;

// src/components/fields/SchemaField.tsx
var import_react5 = require("react");
var import_utils6 = require("@rjsf/utils");
var import_isObject4 = __toESM(require("lodash/isObject"));
var import_omit2 = __toESM(require("lodash/omit"));
var import_markdown_to_jsx2 = __toESM(require("markdown-to-jsx"));
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  const schemaType = (0, import_utils6.getSchemaType)(schema);
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
    const UnsupportedFieldTemplate = (0, import_utils6.getTemplate)(
      "UnsupportedFieldTemplate",
      registry,
      uiOptions
    );
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      UnsupportedFieldTemplate,
      {
        schema,
        idSchema,
        reason: translateString(import_utils6.TranslatableString.UnknownFieldType, [String(schema.type)]),
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
  const uiOptions = (0, import_utils6.getUiOptions)(uiSchema, globalUiOptions);
  const FieldTemplate2 = (0, import_utils6.getTemplate)("FieldTemplate", registry, uiOptions);
  const DescriptionFieldTemplate = (0, import_utils6.getTemplate)(
    "DescriptionFieldTemplate",
    registry,
    uiOptions
  );
  const FieldHelpTemplate2 = (0, import_utils6.getTemplate)("FieldHelpTemplate", registry, uiOptions);
  const FieldErrorTemplate2 = (0, import_utils6.getTemplate)("FieldErrorTemplate", registry, uiOptions);
  const schema = schemaUtils.retrieveSchema(_schema, formData);
  const fieldId = _idSchema[import_utils6.ID_KEY];
  const idSchema = (0, import_utils6.mergeObjects)(
    schemaUtils.toIdSchema(schema, fieldId, formData, idPrefix, idSeparator),
    _idSchema
  );
  const handleFieldComponentChange = (0, import_react5.useCallback)(
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
  const fieldUiSchema = (0, import_omit2.default)(uiSchema, ["ui:classNames", "classNames", "ui:style"]);
  if (import_utils6.UI_OPTIONS_KEY in fieldUiSchema) {
    fieldUiSchema[import_utils6.UI_OPTIONS_KEY] = (0, import_omit2.default)(fieldUiSchema[import_utils6.UI_OPTIONS_KEY], ["classNames", "style"]);
  }
  const field = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  const id = idSchema[import_utils6.ID_KEY];
  let label;
  if (wasPropertyKeyModified) {
    label = name;
  } else {
    label = import_utils6.ADDITIONAL_PROPERTY_FLAG in schema ? name : uiOptions.title || props.schema.title || schema.title || props.title || name;
  }
  const description = uiOptions.description || props.schema.description || schema.description || "";
  const richDescription = uiOptions.enableMarkdownInDescription ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_markdown_to_jsx2.default, { options: { disableParsingRawHTML: true }, children: description }) : description;
  const help = uiOptions.help;
  const hidden = uiOptions.widget === "hidden";
  const classNames = ["form-group", "field", `field-${(0, import_utils6.getSchemaType)(schema)}`];
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
  const helpComponent = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  const errorsComponent = hideError || (schema.anyOf || schema.oneOf) && !schemaUtils.isSelect(schema) ? void 0 : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
    description: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      DescriptionFieldTemplate,
      {
        id: (0, import_utils6.descriptionId)(id),
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
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FieldComponent, { ...fieldProps });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FieldTemplate2, { ...fieldProps, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    field,
    schema.anyOf && !isReplacingAnyOrOneOf && !schemaUtils.isSelect(schema) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
          (_schema2) => schemaUtils.retrieveSchema((0, import_isObject4.default)(_schema2) ? _schema2 : {}, formData)
        ),
        registry,
        schema,
        uiSchema
      }
    ),
    schema.oneOf && !isReplacingAnyOrOneOf && !schemaUtils.isSelect(schema) && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
          (_schema2) => schemaUtils.retrieveSchema((0, import_isObject4.default)(_schema2) ? _schema2 : {}, formData)
        ),
        registry,
        schema,
        uiSchema
      }
    )
  ] }) });
}
var SchemaField = class extends import_react5.Component {
  shouldComponentUpdate(nextProps) {
    return !(0, import_utils6.deepEquals)(this.props, nextProps);
  }
  render() {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SchemaFieldRender, { ...this.props });
  }
};
var SchemaField_default = SchemaField;

// src/components/fields/StringField.tsx
var import_utils7 = require("@rjsf/utils");
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  const enumOptions = schemaUtils.isSelect(schema) ? (0, import_utils7.optionsList)(schema, uiSchema) : void 0;
  let defaultWidget = enumOptions ? "select" : "text";
  if (format && (0, import_utils7.hasWidget)(schema, format, widgets2)) {
    defaultWidget = format;
  }
  const { widget = defaultWidget, placeholder = "", title: uiTitle, ...options } = (0, import_utils7.getUiOptions)(uiSchema);
  const displayLabel = schemaUtils.getDisplayLabel(schema, uiSchema, globalUiOptions);
  const label = uiTitle ?? title ?? name;
  const Widget = (0, import_utils7.getWidget)(schema, widget, widgets2);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
var import_react6 = require("react");
function NullField(props) {
  const { formData, onChange } = props;
  (0, import_react6.useEffect)(() => {
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
var import_utils8 = require("@rjsf/utils");
var import_jsx_runtime8 = require("react/jsx-runtime");
function ArrayFieldDescriptionTemplate(props) {
  const { idSchema, description, registry, schema, uiSchema } = props;
  const options = (0, import_utils8.getUiOptions)(uiSchema, registry.globalUiOptions);
  const { label: displayLabel = true } = options;
  if (!description || !displayLabel) {
    return null;
  }
  const DescriptionFieldTemplate = (0, import_utils8.getTemplate)(
    "DescriptionFieldTemplate",
    registry,
    options
  );
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    DescriptionFieldTemplate,
    {
      id: (0, import_utils8.descriptionId)(idSchema),
      description,
      schema,
      uiSchema,
      registry
    }
  );
}

// src/components/templates/ArrayFieldItemTemplate.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className, children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: hasToolbar ? "col-xs-9" : "col-xs-12", children }),
    hasToolbar && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "col-xs-3 array-item-toolbox", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      "div",
      {
        className: "btn-group",
        style: {
          display: "flex",
          justifyContent: "space-around"
        },
        children: [
          (hasMoveUp || hasMoveDown) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            MoveUpButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly || !hasMoveUp,
              onClick: onReorderClick(index, index - 1),
              uiSchema,
              registry
            }
          ),
          (hasMoveUp || hasMoveDown) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            MoveDownButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly || !hasMoveDown,
              onClick: onReorderClick(index, index + 1),
              uiSchema,
              registry
            }
          ),
          hasCopy && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            CopyButton2,
            {
              style: btnStyle,
              disabled: disabled || readonly,
              onClick: onCopyIndexClick(index),
              uiSchema,
              registry
            }
          ),
          hasRemove && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_utils9 = require("@rjsf/utils");
var import_jsx_runtime10 = require("react/jsx-runtime");
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
  const uiOptions = (0, import_utils9.getUiOptions)(uiSchema);
  const ArrayFieldDescriptionTemplate2 = (0, import_utils9.getTemplate)(
    "ArrayFieldDescriptionTemplate",
    registry,
    uiOptions
  );
  const ArrayFieldItemTemplate2 = (0, import_utils9.getTemplate)(
    "ArrayFieldItemTemplate",
    registry,
    uiOptions
  );
  const ArrayFieldTitleTemplate2 = (0, import_utils9.getTemplate)(
    "ArrayFieldTitleTemplate",
    registry,
    uiOptions
  );
  const {
    ButtonTemplates: { AddButton: AddButton2 }
  } = registry.templates;
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("fieldset", { className, id: idSchema.$id, children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      ArrayFieldDescriptionTemplate2,
      {
        idSchema,
        description: uiOptions.description || schema.description,
        schema,
        uiSchema,
        registry
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: "row array-item-list", children: items && items.map(({ key, ...itemProps }) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ArrayFieldItemTemplate2, { ...itemProps }, key)) }),
    canAdd && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
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
var import_utils10 = require("@rjsf/utils");
var import_jsx_runtime11 = require("react/jsx-runtime");
function ArrayFieldTitleTemplate(props) {
  const { idSchema, title, schema, uiSchema, required, registry } = props;
  const options = (0, import_utils10.getUiOptions)(uiSchema, registry.globalUiOptions);
  const { label: displayLabel = true } = options;
  if (!title || !displayLabel) {
    return null;
  }
  const TitleFieldTemplate = (0, import_utils10.getTemplate)(
    "TitleFieldTemplate",
    registry,
    options
  );
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    TitleFieldTemplate,
    {
      id: (0, import_utils10.titleId)(idSchema),
      title,
      required,
      schema,
      uiSchema,
      registry
    }
  );
}

// src/components/templates/BaseInputTemplate.tsx
var import_react7 = require("react");
var import_utils11 = require("@rjsf/utils");
var import_jsx_runtime12 = require("react/jsx-runtime");
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
    ...(0, import_utils11.getInputProps)(schema, type, options)
  };
  let inputValue;
  if (inputProps.type === "number" || inputProps.type === "integer") {
    inputValue = value || value === 0 ? value : "";
  } else {
    inputValue = value == null ? "" : value;
  }
  const _onChange = (0, import_react7.useCallback)(
    ({ target: { value: value2 } }) => onChange(value2 === "" ? options.emptyValue : value2),
    [onChange, options]
  );
  const _onBlur = (0, import_react7.useCallback)(
    ({ target }) => onBlur(id, target && target.value),
    [onBlur, id]
  );
  const _onFocus = (0, import_react7.useCallback)(
    ({ target }) => onFocus(id, target && target.value),
    [onFocus, id]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
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
        list: schema.examples ? (0, import_utils11.examplesId)(id) : void 0,
        onChange: onChangeOverride || _onChange,
        onBlur: _onBlur,
        onFocus: _onFocus,
        "aria-describedby": (0, import_utils11.ariaDescribedByIds)(id, !!schema.examples)
      }
    ),
    Array.isArray(schema.examples) && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("datalist", { id: (0, import_utils11.examplesId)(id), children: schema.examples.concat(schema.default && !schema.examples.includes(schema.default) ? [schema.default] : []).map((example) => {
      return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("option", { value: example }, example);
    }) }, `datalist_${id}`)
  ] });
}

// src/components/templates/ButtonTemplates/SubmitButton.tsx
var import_utils12 = require("@rjsf/utils");
var import_jsx_runtime13 = require("react/jsx-runtime");
function SubmitButton({ uiSchema }) {
  const { submitText, norender, props: submitButtonProps = {} } = (0, import_utils12.getSubmitButtonOptions)(uiSchema);
  if (norender) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("button", { type: "submit", ...submitButtonProps, className: `btn btn-info ${submitButtonProps.className || ""}`, children: submitText }) });
}

// src/components/templates/ButtonTemplates/AddButton.tsx
var import_utils14 = require("@rjsf/utils");

// src/components/templates/ButtonTemplates/IconButton.tsx
var import_utils13 = require("@rjsf/utils");
var import_jsx_runtime14 = require("react/jsx-runtime");
function IconButton(props) {
  const { iconType = "default", icon, className, uiSchema, registry, ...otherProps } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("button", { type: "button", className: `btn btn-${iconType} ${className}`, ...otherProps, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("i", { className: `glyphicon glyphicon-${icon}` }) });
}
function CopyButton(props) {
  const {
    registry: { translateString }
  } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    IconButton,
    {
      title: translateString(import_utils13.TranslatableString.CopyButton),
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    IconButton,
    {
      title: translateString(import_utils13.TranslatableString.MoveDownButton),
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    IconButton,
    {
      title: translateString(import_utils13.TranslatableString.MoveUpButton),
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
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    IconButton,
    {
      title: translateString(import_utils13.TranslatableString.RemoveButton),
      className: "array-item-remove",
      ...props,
      iconType: "danger",
      icon: "remove"
    }
  );
}

// src/components/templates/ButtonTemplates/AddButton.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function AddButton({
  className,
  onClick,
  disabled,
  registry
}) {
  const { translateString } = registry;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "row", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: `col-xs-3 col-xs-offset-9 text-right ${className}`, children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    IconButton,
    {
      iconType: "info",
      icon: "plus",
      className: "btn-add col-xs-12",
      title: translateString(import_utils14.TranslatableString.AddButton),
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
var import_jsx_runtime16 = require("react/jsx-runtime");
function DescriptionField(props) {
  const { id, description } = props;
  if (!description) {
    return null;
  }
  if (typeof description === "string") {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { id, className: "field-description", children: description });
  } else {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { id, className: "field-description", children: description });
  }
}

// src/components/templates/ErrorList.tsx
var import_utils15 = require("@rjsf/utils");
var import_jsx_runtime17 = require("react/jsx-runtime");
function ErrorList({
  errors,
  registry
}) {
  const { translateString } = registry;
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "panel panel-danger errors", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "panel-heading", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("h3", { className: "panel-title", children: translateString(import_utils15.TranslatableString.ErrorsLabel) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("ul", { className: "list-group", children: errors.map((error, i) => {
      return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("li", { className: "list-group-item text-danger", children: error.stack }, i);
    }) })
  ] });
}

// src/components/templates/FieldTemplate/FieldTemplate.tsx
var import_utils16 = require("@rjsf/utils");

// src/components/templates/FieldTemplate/Label.tsx
var import_jsx_runtime18 = require("react/jsx-runtime");
var REQUIRED_FIELD_SYMBOL = "*";
function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("label", { className: "control-label", htmlFor: id, children: [
    label,
    required && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "required", children: REQUIRED_FIELD_SYMBOL })
  ] });
}

// src/components/templates/FieldTemplate/FieldTemplate.tsx
var import_jsx_runtime19 = require("react/jsx-runtime");
function FieldTemplate(props) {
  const { id, label, children, errors, help, description, hidden, required, displayLabel, registry, uiSchema } = props;
  const uiOptions = (0, import_utils16.getUiOptions)(uiSchema);
  const WrapIfAdditionalTemplate2 = (0, import_utils16.getTemplate)(
    "WrapIfAdditionalTemplate",
    registry,
    uiOptions
  );
  if (hidden) {
    return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "hidden", children });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(WrapIfAdditionalTemplate2, { ...props, children: [
    displayLabel && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Label, { label, required, id }),
    displayLabel && description ? description : null,
    children,
    errors,
    help
  ] });
}

// src/components/templates/FieldTemplate/index.ts
var FieldTemplate_default = FieldTemplate;

// src/components/templates/FieldErrorTemplate.tsx
var import_utils17 = require("@rjsf/utils");
var import_jsx_runtime20 = require("react/jsx-runtime");
function FieldErrorTemplate(props) {
  const { errors = [], idSchema } = props;
  if (errors.length === 0) {
    return null;
  }
  const id = (0, import_utils17.errorId)(idSchema);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("ul", { id, className: "error-detail bs-callout bs-callout-info", children: errors.filter((elem) => !!elem).map((error, index) => {
    return /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("li", { className: "text-danger", children: error }, index);
  }) }) });
}

// src/components/templates/FieldHelpTemplate.tsx
var import_utils18 = require("@rjsf/utils");
var import_jsx_runtime21 = require("react/jsx-runtime");
function FieldHelpTemplate(props) {
  const { idSchema, help } = props;
  if (!help) {
    return null;
  }
  const id = (0, import_utils18.helpId)(idSchema);
  if (typeof help === "string") {
    return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("p", { id, className: "help-block", children: help });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { id, className: "help-block", children: help });
}

// src/components/templates/ObjectFieldTemplate.tsx
var import_utils19 = require("@rjsf/utils");
var import_jsx_runtime22 = require("react/jsx-runtime");
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
  const options = (0, import_utils19.getUiOptions)(uiSchema);
  const TitleFieldTemplate = (0, import_utils19.getTemplate)("TitleFieldTemplate", registry, options);
  const DescriptionFieldTemplate = (0, import_utils19.getTemplate)(
    "DescriptionFieldTemplate",
    registry,
    options
  );
  const {
    ButtonTemplates: { AddButton: AddButton2 }
  } = registry.templates;
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("fieldset", { id: idSchema.$id, children: [
    title && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      TitleFieldTemplate,
      {
        id: (0, import_utils19.titleId)(idSchema),
        title,
        required,
        schema,
        uiSchema,
        registry
      }
    ),
    description && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      DescriptionFieldTemplate,
      {
        id: (0, import_utils19.descriptionId)(idSchema),
        description,
        schema,
        uiSchema,
        registry
      }
    ),
    properties.map((prop) => prop.content),
    (0, import_utils19.canExpand)(schema, uiSchema, formData) && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
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
var import_jsx_runtime23 = require("react/jsx-runtime");
var REQUIRED_FIELD_SYMBOL2 = "*";
function TitleField(props) {
  const { id, title, required } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsxs)("legend", { id, children: [
    title,
    required && /* @__PURE__ */ (0, import_jsx_runtime23.jsx)("span", { className: "required", children: REQUIRED_FIELD_SYMBOL2 })
  ] });
}

// src/components/templates/UnsupportedField.tsx
var import_utils20 = require("@rjsf/utils");
var import_markdown_to_jsx3 = __toESM(require("markdown-to-jsx"));
var import_jsx_runtime24 = require("react/jsx-runtime");
function UnsupportedField(props) {
  const { schema, idSchema, reason, registry } = props;
  const { translateString } = registry;
  let translateEnum = import_utils20.TranslatableString.UnsupportedField;
  const translateParams = [];
  if (idSchema && idSchema.$id) {
    translateEnum = import_utils20.TranslatableString.UnsupportedFieldWithId;
    translateParams.push(idSchema.$id);
  }
  if (reason) {
    translateEnum = translateEnum === import_utils20.TranslatableString.UnsupportedField ? import_utils20.TranslatableString.UnsupportedFieldWithReason : import_utils20.TranslatableString.UnsupportedFieldWithIdAndReason;
    translateParams.push(reason);
  }
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "unsupported-field", children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_markdown_to_jsx3.default, { options: { disableParsingRawHTML: true }, children: translateString(translateEnum, translateParams) }) }),
    schema && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("pre", { children: JSON.stringify(schema, null, 2) })
  ] });
}
var UnsupportedField_default = UnsupportedField;

// src/components/templates/WrapIfAdditionalTemplate.tsx
var import_utils21 = require("@rjsf/utils");
var import_jsx_runtime25 = require("react/jsx-runtime");
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
  const keyLabel = translateString(import_utils21.TranslatableString.KeyLabel, [label]);
  const additional = import_utils21.ADDITIONAL_PROPERTY_FLAG in schema;
  if (!additional) {
    return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: classNames, style, children });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: classNames, style, children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "row", children: [
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "col-xs-5 form-additional", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "form-group", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(Label, { label: keyLabel, required, id: `${id}-key` }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "form-additional form-group col-xs-5", children }),
    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "col-xs-2", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
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
var import_react8 = require("react");
var import_utils22 = require("@rjsf/utils");
var import_jsx_runtime26 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
    SelectWidget2,
    {
      schema: { type: "integer" },
      id,
      name,
      className: "form-control",
      options: { enumOptions: (0, import_utils22.dateRangeOptions)(range[0], range[1]) },
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
      "aria-describedby": (0, import_utils22.ariaDescribedByIds)(rootId)
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
  const [lastValue, setLastValue] = (0, import_react8.useState)(value);
  const [state, setState] = (0, import_react8.useReducer)((state2, action) => {
    return { ...state2, ...action };
  }, (0, import_utils22.parseDateString)(value, time));
  (0, import_react8.useEffect)(() => {
    const stateValue = (0, import_utils22.toDateString)(state, time);
    if (readyForChange(state) && stateValue !== value) {
      onChange(stateValue);
    } else if (lastValue !== value) {
      setLastValue(value);
      setState((0, import_utils22.parseDateString)(value, time));
    }
  }, [time, value, onChange, state, lastValue]);
  const handleChange = (0, import_react8.useCallback)((property, value2) => {
    setState({ [property]: value2 });
  }, []);
  const handleSetNow = (0, import_react8.useCallback)(
    (event) => {
      event.preventDefault();
      if (disabled || readonly) {
        return;
      }
      const nextState = (0, import_utils22.parseDateString)((/* @__PURE__ */ new Date()).toJSON(), time);
      onChange((0, import_utils22.toDateString)(nextState, time));
    },
    [disabled, readonly, time]
  );
  const handleClear = (0, import_react8.useCallback)(
    (event) => {
      event.preventDefault();
      if (disabled || readonly) {
        return;
      }
      onChange(void 0);
    },
    [disabled, readonly, onChange]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)("ul", { className: "list-inline", children: [
    (0, import_utils22.getDateElementProps)(
      state,
      time,
      options.yearsRange,
      options.format
    ).map((elemProps, i) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("li", { className: "list-inline-item", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(
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
    (options.hideNowButton !== "undefined" ? !options.hideNowButton : true) && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("li", { className: "list-inline-item", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("a", { href: "#", className: "btn btn-info btn-now", onClick: handleSetNow, children: translateString(import_utils22.TranslatableString.NowLabel) }) }),
    (options.hideClearButton !== "undefined" ? !options.hideClearButton : true) && /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("li", { className: "list-inline-item", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("a", { href: "#", className: "btn btn-warning btn-clear", onClick: handleClear, children: translateString(import_utils22.TranslatableString.ClearLabel) }) })
  ] });
}
var AltDateWidget_default = AltDateWidget;

// src/components/widgets/AltDateTimeWidget.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
function AltDateTimeWidget({
  time = true,
  ...props
}) {
  const { AltDateWidget: AltDateWidget2 } = props.registry.widgets;
  return /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(AltDateWidget2, { time, ...props });
}
var AltDateTimeWidget_default = AltDateTimeWidget;

// src/components/widgets/CheckboxWidget.tsx
var import_react9 = require("react");
var import_utils23 = require("@rjsf/utils");
var import_jsx_runtime28 = require("react/jsx-runtime");
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
  const DescriptionFieldTemplate = (0, import_utils23.getTemplate)(
    "DescriptionFieldTemplate",
    registry,
    options
  );
  const required = (0, import_utils23.schemaRequiresTrueValue)(schema);
  const handleChange = (0, import_react9.useCallback)(
    (event) => onChange(event.target.checked),
    [onChange]
  );
  const handleBlur = (0, import_react9.useCallback)(
    (event) => onBlur(id, event.target.checked),
    [onBlur, id]
  );
  const handleFocus = (0, import_react9.useCallback)(
    (event) => onFocus(id, event.target.checked),
    [onFocus, id]
  );
  const description = options.description ?? schema.description;
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: `checkbox ${disabled || readonly ? "disabled" : ""}`, children: [
    !hideLabel && !!description && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
      DescriptionFieldTemplate,
      {
        id: (0, import_utils23.descriptionId)(id),
        description,
        schema,
        uiSchema,
        registry
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("label", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
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
          "aria-describedby": (0, import_utils23.ariaDescribedByIds)(id)
        }
      ),
      (0, import_utils23.labelValue)(/* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { children: label }), hideLabel)
    ] })
  ] });
}
var CheckboxWidget_default = CheckboxWidget;

// src/components/widgets/CheckboxesWidget.tsx
var import_react10 = require("react");
var import_utils24 = require("@rjsf/utils");
var import_jsx_runtime29 = require("react/jsx-runtime");
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
  const handleBlur = (0, import_react10.useCallback)(
    ({ target }) => onBlur(id, (0, import_utils24.enumOptionsValueForIndex)(target && target.value, enumOptions, emptyValue)),
    [onBlur, id]
  );
  const handleFocus = (0, import_react10.useCallback)(
    ({ target }) => onFocus(id, (0, import_utils24.enumOptionsValueForIndex)(target && target.value, enumOptions, emptyValue)),
    [onFocus, id]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: "checkboxes", id, children: Array.isArray(enumOptions) && enumOptions.map((option, index) => {
    const checked = (0, import_utils24.enumOptionsIsSelected)(option.value, checkboxesValues);
    const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;
    const disabledCls = disabled || itemDisabled || readonly ? "disabled" : "";
    const handleChange = (event) => {
      if (event.target.checked) {
        onChange((0, import_utils24.enumOptionsSelectValue)(index, checkboxesValues, enumOptions));
      } else {
        onChange((0, import_utils24.enumOptionsDeselectValue)(index, checkboxesValues, enumOptions));
      }
    };
    const checkbox = /* @__PURE__ */ (0, import_jsx_runtime29.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(
        "input",
        {
          type: "checkbox",
          id: (0, import_utils24.optionId)(id, index),
          name: id,
          checked,
          value: String(index),
          disabled: disabled || itemDisabled || readonly,
          autoFocus: autofocus && index === 0,
          onChange: handleChange,
          onBlur: handleBlur,
          onFocus: handleFocus,
          "aria-describedby": (0, import_utils24.ariaDescribedByIds)(id)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("span", { children: option.label })
    ] });
    return inline ? /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("label", { className: `checkbox-inline ${disabledCls}`, children: checkbox }, index) : /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("div", { className: `checkbox ${disabledCls}`, children: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)("label", { children: checkbox }) }, index);
  }) });
}
var CheckboxesWidget_default = CheckboxesWidget;

// src/components/widgets/ColorWidget.tsx
var import_utils25 = require("@rjsf/utils");
var import_jsx_runtime30 = require("react/jsx-runtime");
function ColorWidget(props) {
  const { disabled, readonly, options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils25.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(BaseInputTemplate2, { type: "color", ...props, disabled: disabled || readonly });
}

// src/components/widgets/DateWidget.tsx
var import_react11 = require("react");
var import_utils26 = require("@rjsf/utils");
var import_jsx_runtime31 = require("react/jsx-runtime");
function DateWidget(props) {
  const { onChange, options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils26.getTemplate)("BaseInputTemplate", registry, options);
  const handleChange = (0, import_react11.useCallback)((value) => onChange(value || void 0), [onChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(BaseInputTemplate2, { type: "date", ...props, onChange: handleChange });
}

// src/components/widgets/DateTimeWidget.tsx
var import_utils27 = require("@rjsf/utils");
var import_jsx_runtime32 = require("react/jsx-runtime");
function DateTimeWidget(props) {
  const { onChange, value, options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils27.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
    BaseInputTemplate2,
    {
      type: "datetime-local",
      ...props,
      value: (0, import_utils27.utcToLocal)(value),
      onChange: (value2) => onChange((0, import_utils27.localToUTC)(value2))
    }
  );
}

// src/components/widgets/EmailWidget.tsx
var import_utils28 = require("@rjsf/utils");
var import_jsx_runtime33 = require("react/jsx-runtime");
function EmailWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils28.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(BaseInputTemplate2, { type: "email", ...props });
}

// src/components/widgets/FileWidget.tsx
var import_react12 = require("react");
var import_utils29 = require("@rjsf/utils");
var import_markdown_to_jsx4 = __toESM(require("markdown-to-jsx"));
var import_jsx_runtime34 = require("react/jsx-runtime");
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
    return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("img", { src: dataURL, style: { maxWidth: "100%" }, className: "file-preview" });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(import_jsx_runtime34.Fragment, { children: [
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("a", { download: `preview-${name}`, href: dataURL, className: "file-download", children: translateString(import_utils29.TranslatableString.PreviewLabel) })
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
  const { RemoveButton: RemoveButton2 } = (0, import_utils29.getTemplate)("ButtonTemplates", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("ul", { className: "file-info", children: filesInfo.map((fileInfo, key) => {
    const { name, size, type } = fileInfo;
    const handleRemove = () => onRemove(key);
    return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("li", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_markdown_to_jsx4.default, { children: translateString(import_utils29.TranslatableString.FilesInfo, [name, type, String(size)]) }),
      preview && /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(FileInfoPreview, { fileInfo, registry }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(RemoveButton2, { onClick: handleRemove, registry })
    ] }, key);
  }) });
}
function extractFileInfo(dataURLs) {
  return dataURLs.reduce((acc, dataURL) => {
    if (!dataURL) {
      return acc;
    }
    try {
      const { blob, name } = (0, import_utils29.dataURItoBlob)(dataURL);
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
  const BaseInputTemplate2 = (0, import_utils29.getTemplate)("BaseInputTemplate", registry, options);
  const handleChange = (0, import_react12.useCallback)(
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
  const filesInfo = (0, import_react12.useMemo)(() => extractFileInfo(Array.isArray(value) ? value : [value]), [value]);
  const rmFile = (0, import_react12.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
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
var import_jsx_runtime35 = require("react/jsx-runtime");
function HiddenWidget({
  id,
  value
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("input", { type: "hidden", id, name: id, value: typeof value === "undefined" ? "" : value });
}
var HiddenWidget_default = HiddenWidget;

// src/components/widgets/PasswordWidget.tsx
var import_utils30 = require("@rjsf/utils");
var import_jsx_runtime36 = require("react/jsx-runtime");
function PasswordWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils30.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)(BaseInputTemplate2, { type: "password", ...props });
}

// src/components/widgets/RadioWidget.tsx
var import_react13 = require("react");
var import_utils31 = require("@rjsf/utils");
var import_jsx_runtime37 = require("react/jsx-runtime");
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
  const handleBlur = (0, import_react13.useCallback)(
    ({ target }) => onBlur(id, (0, import_utils31.enumOptionsValueForIndex)(target && target.value, enumOptions, emptyValue)),
    [onBlur, id]
  );
  const handleFocus = (0, import_react13.useCallback)(
    ({ target }) => onFocus(id, (0, import_utils31.enumOptionsValueForIndex)(target && target.value, enumOptions, emptyValue)),
    [onFocus, id]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "field-radio-group", id, children: Array.isArray(enumOptions) && enumOptions.map((option, i) => {
    const checked = (0, import_utils31.enumOptionsIsSelected)(option.value, value);
    const itemDisabled = Array.isArray(enumDisabled) && enumDisabled.indexOf(option.value) !== -1;
    const disabledCls = disabled || itemDisabled || readonly ? "disabled" : "";
    const handleChange = () => onChange(option.value);
    const radio = /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("span", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
        "input",
        {
          type: "radio",
          id: (0, import_utils31.optionId)(id, i),
          checked,
          name: id,
          required,
          value: String(i),
          disabled: disabled || itemDisabled || readonly,
          autoFocus: autofocus && i === 0,
          onChange: handleChange,
          onBlur: handleBlur,
          onFocus: handleFocus,
          "aria-describedby": (0, import_utils31.ariaDescribedByIds)(id)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("span", { children: option.label })
    ] });
    return inline ? /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { className: `radio-inline ${disabledCls}`, children: radio }, i) : /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: `radio ${disabledCls}`, children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { children: radio }) }, i);
  }) });
}
var RadioWidget_default = RadioWidget;

// src/components/widgets/RangeWidget.tsx
var import_jsx_runtime38 = require("react/jsx-runtime");
function RangeWidget(props) {
  const {
    value,
    registry: {
      templates: { BaseInputTemplate: BaseInputTemplate2 }
    }
  } = props;
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "field-range-wrapper", children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(BaseInputTemplate2, { type: "range", ...props }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "range-view", children: value })
  ] });
}

// src/components/widgets/SelectWidget.tsx
var import_react14 = require("react");
var import_utils32 = require("@rjsf/utils");
var import_jsx_runtime39 = require("react/jsx-runtime");
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
  const handleFocus = (0, import_react14.useCallback)(
    (event) => {
      const newValue = getValue(event, multiple);
      return onFocus(id, (0, import_utils32.enumOptionsValueForIndex)(newValue, enumOptions, optEmptyVal));
    },
    [onFocus, id, schema, multiple, enumOptions, optEmptyVal]
  );
  const handleBlur = (0, import_react14.useCallback)(
    (event) => {
      const newValue = getValue(event, multiple);
      return onBlur(id, (0, import_utils32.enumOptionsValueForIndex)(newValue, enumOptions, optEmptyVal));
    },
    [onBlur, id, schema, multiple, enumOptions, optEmptyVal]
  );
  const handleChange = (0, import_react14.useCallback)(
    (event) => {
      const newValue = getValue(event, multiple);
      return onChange((0, import_utils32.enumOptionsValueForIndex)(newValue, enumOptions, optEmptyVal));
    },
    [onChange, schema, multiple, enumOptions, optEmptyVal]
  );
  const selectedIndexes = (0, import_utils32.enumOptionsIndexForValue)(value, enumOptions, multiple);
  const showPlaceholderOption = !multiple && schema.default === void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(
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
      "aria-describedby": (0, import_utils32.ariaDescribedByIds)(id),
      children: [
        showPlaceholderOption && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("option", { value: "", children: placeholder }),
        Array.isArray(enumOptions) && enumOptions.map(({ value: value2, label }, i) => {
          const disabled2 = enumDisabled && enumDisabled.indexOf(value2) !== -1;
          return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)("option", { value: String(i), disabled: disabled2, children: label }, i);
        })
      ]
    }
  );
}
var SelectWidget_default = SelectWidget;

// src/components/widgets/TextareaWidget.tsx
var import_react15 = require("react");
var import_utils33 = require("@rjsf/utils");
var import_jsx_runtime40 = require("react/jsx-runtime");
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
  const handleChange = (0, import_react15.useCallback)(
    ({ target: { value: value2 } }) => onChange(value2 === "" ? options.emptyValue : value2),
    [onChange, options.emptyValue]
  );
  const handleBlur = (0, import_react15.useCallback)(
    ({ target }) => onBlur(id, target && target.value),
    [onBlur, id]
  );
  const handleFocus = (0, import_react15.useCallback)(
    ({ target }) => onFocus(id, target && target.value),
    [id, onFocus]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime40.jsx)(
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
      "aria-describedby": (0, import_utils33.ariaDescribedByIds)(id)
    }
  );
}
TextareaWidget.defaultProps = {
  autofocus: false,
  options: {}
};
var TextareaWidget_default = TextareaWidget;

// src/components/widgets/TextWidget.tsx
var import_utils34 = require("@rjsf/utils");
var import_jsx_runtime41 = require("react/jsx-runtime");
function TextWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils34.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime41.jsx)(BaseInputTemplate2, { ...props });
}

// src/components/widgets/TimeWidget.tsx
var import_react16 = require("react");
var import_utils35 = require("@rjsf/utils");
var import_jsx_runtime42 = require("react/jsx-runtime");
function TimeWidget(props) {
  const { onChange, options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils35.getTemplate)("BaseInputTemplate", registry, options);
  const handleChange = (0, import_react16.useCallback)((value) => onChange(value ? `${value}:00` : void 0), [onChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime42.jsx)(BaseInputTemplate2, { type: "time", ...props, onChange: handleChange });
}

// src/components/widgets/URLWidget.tsx
var import_utils36 = require("@rjsf/utils");
var import_jsx_runtime43 = require("react/jsx-runtime");
function URLWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils36.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime43.jsx)(BaseInputTemplate2, { type: "url", ...props });
}

// src/components/widgets/UpDownWidget.tsx
var import_utils37 = require("@rjsf/utils");
var import_jsx_runtime44 = require("react/jsx-runtime");
function UpDownWidget(props) {
  const { options, registry } = props;
  const BaseInputTemplate2 = (0, import_utils37.getTemplate)("BaseInputTemplate", registry, options);
  return /* @__PURE__ */ (0, import_jsx_runtime44.jsx)(BaseInputTemplate2, { type: "number", ...props });
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
    translateString: import_utils38.englishStringTranslator
  };
}

// src/components/Form.tsx
var import_jsx_runtime45 = require("react/jsx-runtime");
var Form = class extends import_react17.Component {
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
      const data = (0, import_pick.default)(formData, fields2);
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
            if (_obj[key][import_utils39.RJSF_ADDITIONAL_PROPERTIES_FLAG] && _obj[key][import_utils39.NAME_KEY] !== "") {
              acc.push(_obj[key][import_utils39.NAME_KEY]);
            } else {
              getAllPaths(_obj[key], acc, newPaths);
            }
          } else if (key === import_utils39.NAME_KEY && _obj[key] !== "") {
            paths.forEach((path) => {
              const formValue = (0, import_get4.default)(formData, path);
              if (typeof formValue !== "object" || (0, import_isEmpty2.default)(formValue) || Array.isArray(formValue) && formValue.every((val) => typeof val !== "object")) {
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
      if ((0, import_utils39.isObject)(formData) || Array.isArray(formData)) {
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
          const merged = (0, import_utils39.validationDataMerge)(schemaValidation, extraErrors);
          errorSchema = merged.errorSchema;
          errors = merged.errors;
        }
        if (newErrorSchema) {
          const filteredErrors = this.filterErrorsBasedOnSchema(newErrorSchema, retrievedSchema, newFormData);
          errorSchema = (0, import_utils39.mergeObjects)(errorSchema, filteredErrors, "preventDuplicates");
        }
        state = {
          formData: newFormData,
          errors,
          errorSchema,
          schemaValidationErrors,
          schemaValidationErrorSchema
        };
      } else if (!noValidate && newErrorSchema) {
        const errorSchema = extraErrors ? (0, import_utils39.mergeObjects)(newErrorSchema, extraErrors, "preventDuplicates") : newErrorSchema;
        state = {
          formData: newFormData,
          errorSchema,
          errors: (0, import_utils39.toErrorList)(errorSchema)
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
        const errors = extraErrors ? (0, import_utils39.toErrorList)(extraErrors) : [];
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
          const merged = (0, import_utils39.validationDataMerge)(schemaValidation, extraErrors);
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
    if (this.props.onChange && !(0, import_utils39.deepEquals)(this.state.formData, this.props.formData)) {
      this.props.onChange(this.state);
    }
    this.formElement = (0, import_react17.createRef)();
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
    if (!(0, import_utils39.deepEquals)(this.props, prevProps)) {
      const isSchemaChanged = !(0, import_utils39.deepEquals)(prevProps.schema, this.props.schema);
      const isFormDataChanged = !(0, import_utils39.deepEquals)(prevProps.formData, this.props.formData);
      const nextState = this.getStateFromProps(
        this.props,
        this.props.formData,
        // If the `schema` has changed, we need to update the retrieved schema.
        // Or if the `formData` changes, for example in the case of a schema with dependencies that need to
        //  match one of the subSchemas, the retrieved schema must be updated.
        isSchemaChanged || isFormDataChanged ? void 0 : this.state.retrievedSchema,
        isSchemaChanged
      );
      const shouldUpdate = !(0, import_utils39.deepEquals)(nextState, prevState);
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
      if (!(0, import_utils39.deepEquals)(nextState.formData, this.props.formData) && !(0, import_utils39.deepEquals)(nextState.formData, prevState.formData) && this.props.onChange) {
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
      schemaUtils = (0, import_utils39.createSchemaUtils)(props.validator, rootSchema, experimental_defaultFormStateBehavior);
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
        errorSchema = (0, import_utils39.mergeObjects)(
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
      const merged = (0, import_utils39.validationDataMerge)({ errorSchema, errors }, props.extraErrors);
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
    return (0, import_utils39.shouldRender)(this, nextProps, nextState);
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
    const options = (0, import_utils39.getUiOptions)(uiSchema);
    const ErrorListTemplate = (0, import_utils39.getTemplate)("ErrorListTemplate", registry, options);
    if (errors && errors.length) {
      return /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
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
    const filteredErrors = (0, import_pick.default)(schemaErrors, fieldNames);
    if (resolvedSchema?.type !== "object" && resolvedSchema?.type !== "array") {
      filteredErrors.__errors = schemaErrors.__errors;
    }
    const filterUndefinedErrors = (errors) => {
      (0, import_forEach.default)(errors, (errorAtKey, errorKey) => {
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
      globalUiOptions: uiSchema[import_utils39.UI_GLOBAL_OPTIONS_KEY]
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
    const path = (0, import_toPath.default)(property);
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
    let { [import_utils39.SUBMIT_BTN_OPTIONS_KEY]: submitOptions = {} } = (0, import_utils39.getUiOptions)(uiSchema);
    if (disabled) {
      submitOptions = { ...submitOptions, props: { ...submitOptions.props, disabled: true } };
    }
    const submitUiSchema = { [import_utils39.UI_OPTIONS_KEY]: { [import_utils39.SUBMIT_BTN_OPTIONS_KEY]: submitOptions } };
    return /* @__PURE__ */ (0, import_jsx_runtime45.jsxs)(
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
          /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(
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
          children ? children : /* @__PURE__ */ (0, import_jsx_runtime45.jsx)(SubmitButton2, { uiSchema: submitUiSchema, registry }),
          showErrorList === "bottom" && this.renderErrors(registry)
        ]
      }
    );
  }
};

// src/withTheme.tsx
var import_react18 = require("react");
var import_jsx_runtime46 = require("react/jsx-runtime");
function withTheme(themeProps) {
  return (0, import_react18.forwardRef)(
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
      return /* @__PURE__ */ (0, import_jsx_runtime46.jsx)(
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
//# sourceMappingURL=index.js.map
