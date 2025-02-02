/**
 * Theme configuration helpers.
 *
 * @description Test if a configuration is set or fetch its value. If `exclude_page` is set, the helpers will
 *              not look up configurations in the current page's front matter.
 * @example
 *     <%- has_config(config_name, exclude_page) %>
 *     <%- get_config(config_name, default_value, exclude_page) %>
 */
const specs = require('../specs/config.spec');
const descriptors = require('../common/utils').descriptors;

module.exports = function (hexo) {
    function readProperty(object, path) {
        const paths = path.split('.');
        for (let path of paths) {
            if (typeof (object) === 'undefined' || object === null || !object.hasOwnProperty(path)) {
                return null;
            }
            object = object[path];
        }
        return object;
    }

    hexo.extend.helper.register('get_config', function (configName, defaultValue = undefined, excludePage = false) {
        const value = readProperty(Object.assign({}, this.config, hexo.theme.config,
            !excludePage ? this.page : {}), configName);
        if (value === null) {
            if (typeof(defaultValue) !== 'undefined') {
                return defaultValue;
            } else {
                const property = readProperty(specs, configName);
                // return property === null ? null : property[descriptors.defaultValue];
                // update by thank: 默认就开启文章目录, 不用每个md文件都去写`toc: true`
                const result = property === null ? null : property[descriptors.defaultValue];
                return (configName === 'toc' && this.page.layout === 'post' && result === null) ? true : result;
            }

        }
        return value;
    });

    hexo.extend.helper.register('has_config', function (configName, excludePage = false) {
        const readProperty = hexo.extend.helper.get('get_config').bind(this);
        return readProperty(configName, null, excludePage) != null;
    });

    hexo.extend.helper.register('get_config_from_obj', function (object, configName, defaultValue = null) {
        const value = readProperty(object, configName);
        return value === null ? defaultValue : value;
    });
}
