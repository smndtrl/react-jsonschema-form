import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { dataURItoBlob, getTemplate, TranslatableString, } from '@rjsf/utils';
import Markdown from 'markdown-to-jsx';
function addNameToDataURL(dataURL, name) {
    if (dataURL === null) {
        return null;
    }
    return dataURL.replace(';base64', `;name=${encodeURIComponent(name)};base64`);
}
function processFile(file) {
    const { name, size, type } = file;
    return new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.onerror = reject;
        reader.onload = (event) => {
            var _a;
            if (typeof ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) === 'string') {
                resolve({
                    dataURL: addNameToDataURL(event.target.result, name),
                    name,
                    size,
                    type,
                });
            }
            else {
                resolve({
                    dataURL: null,
                    name,
                    size,
                    type,
                });
            }
        };
        reader.readAsDataURL(file);
    });
}
function processFiles(files) {
    return Promise.all(Array.from(files).map(processFile));
}
function FileInfoPreview({ fileInfo, registry, }) {
    const { translateString } = registry;
    const { dataURL, type, name } = fileInfo;
    if (!dataURL) {
        return null;
    }
    // If type is JPEG or PNG then show image preview.
    // Originally, any type of image was supported, but this was changed into a whitelist
    // since SVGs and animated GIFs are also images, which are generally considered a security risk.
    if (['image/jpeg', 'image/png'].includes(type)) {
        return _jsx("img", { src: dataURL, style: { maxWidth: '100%' }, className: 'file-preview' });
    }
    // otherwise, let users download file
    return (_jsxs(_Fragment, { children: [' ', _jsx("a", { download: `preview-${name}`, href: dataURL, className: 'file-download', children: translateString(TranslatableString.PreviewLabel) })] }));
}
function FilesInfo({ filesInfo, registry, preview, onRemove, options, }) {
    if (filesInfo.length === 0) {
        return null;
    }
    const { translateString } = registry;
    const { RemoveButton } = getTemplate('ButtonTemplates', registry, options);
    return (_jsx("ul", { className: 'file-info', children: filesInfo.map((fileInfo, key) => {
            const { name, size, type } = fileInfo;
            const handleRemove = () => onRemove(key);
            return (_jsxs("li", { children: [_jsx(Markdown, { children: translateString(TranslatableString.FilesInfo, [name, type, String(size)]) }), preview && _jsx(FileInfoPreview, { fileInfo: fileInfo, registry: registry }), _jsx(RemoveButton, { onClick: handleRemove, registry: registry })] }, key));
        }) }));
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
                    name: name,
                    size: blob.size,
                    type: blob.type,
                },
            ];
        }
        catch (e) {
            // Invalid dataURI, so just ignore it.
            return acc;
        }
    }, []);
}
/**
 *  The `FileWidget` is a widget for rendering file upload fields.
 *  It is typically used with a string property with data-url format.
 */
function FileWidget(props) {
    const { disabled, readonly, required, multiple, onChange, value, options, registry } = props;
    const BaseInputTemplate = getTemplate('BaseInputTemplate', registry, options);
    const handleChange = useCallback((event) => {
        if (!event.target.files) {
            return;
        }
        // Due to variances in themes, dealing with multiple files for the array case now happens one file at a time.
        // This is because we don't pass `multiple` into the `BaseInputTemplate` anymore. Instead, we deal with the single
        // file in each event and concatenate them together ourselves
        processFiles(event.target.files).then((filesInfoEvent) => {
            const newValue = filesInfoEvent.map((fileInfo) => fileInfo.dataURL);
            if (multiple) {
                onChange(value.concat(newValue[0]));
            }
            else {
                onChange(newValue[0]);
            }
        });
    }, [multiple, value, onChange]);
    const filesInfo = useMemo(() => extractFileInfo(Array.isArray(value) ? value : [value]), [value]);
    const rmFile = useCallback((index) => {
        if (multiple) {
            const newValue = value.filter((_, i) => i !== index);
            onChange(newValue);
        }
        else {
            onChange(undefined);
        }
    }, [multiple, value, onChange]);
    return (_jsxs("div", { children: [_jsx(BaseInputTemplate, { ...props, disabled: disabled || readonly, type: 'file', required: value ? false : required, onChangeOverride: handleChange, value: '', accept: options.accept ? String(options.accept) : undefined }), _jsx(FilesInfo, { filesInfo: filesInfo, onRemove: rmFile, registry: registry, preview: options.filePreview, options: options })] }));
}
export default FileWidget;
//# sourceMappingURL=FileWidget.js.map