/**
 * If both layers have same group, they are ordered by layer.getName()
 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
 * @param {String} method layer method name to sort by
 */
const comparator = (a, b, method) => {
    var nameA = a[method]().toLowerCase();
    var nameB = b[method]().toLowerCase();
    if (nameA === nameB && (a.getName() && b.getName())) {
        nameA = a.getName().toLowerCase();
        nameB = b.getName().toLowerCase();
    }
    return Oskari.util.naturalSort(nameA, nameB);
};

/**
 * @param {Oskari.mapframework.domain.AbstractLayer[]} layers layers to group
 * @param {String} method layer method name to sort by
 */
export const groupLayers = (layers, method, tools, themes = [], dataProviders = [], loc) => {
    const groupList = [];
    let group = null;
    let groupForOrphans = null;

    const determineGroupId = (layerGroups, layerAdmin) => {
        let groupId;
        if (method === 'getInspireName') {
            groupId = layerGroups[0] ? layerGroups[0].id : undefined;
            // Analysis and myplaces layers don't have numeric id.
            if (typeof groupId !== 'number') {
                groupId = undefined;
            }
        } else {
            // Analysis and myplaces layers don't have admin information.
            groupId = layerAdmin ? layerAdmin.organizationId : undefined;
        }
        return groupId;
    };

    // sort layers by grouping & name
    layers.sort((a, b) => comparator(a, b, method))
        .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
        .forEach(layer => {
            let groupAttr = layer[method]();
            let groupId = determineGroupId(layer._groups, layer.admin);

            // If grouping can be determined, create group if already not created
            if (!group || (typeof groupAttr !== 'undefined' && groupAttr !== '' && group.getTitle() !== groupAttr)) {
                group = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    groupId, method, groupAttr
                );
                groupList.push(group);
            }
            // Add layer and tools to group if grouping can be determined
            if (groupAttr) {
                group.addLayer(layer);
                group.setTools(tools);
            }
            // Create group for orphan layers if not already created and add layer to it
            if (!groupAttr) {
                if (!groupForOrphans) {
                    groupForOrphans = Oskari.clazz.create(
                        'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                        groupId, method, method === 'getInspireName' ? loc.grouping.noTheme : loc.grouping.noDataProvider
                    );
                }
                groupForOrphans.addLayer(layer);
            }
        });

    let groupsWithoutLayers;
    const lang = Oskari.getLang();
    if (method === 'getInspireName') {
        groupsWithoutLayers = themes.filter(t => groupList.filter(g => g.id === t.id).length === 0).map(t => {
            const group = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                t.id, method, t.name[lang]
            );
            group.setTools(tools);
            return group;
        });
    } else {
        groupsWithoutLayers = dataProviders.filter(t => groupList.filter(g => g.id === t.id).length === 0).map(d => {
            const group = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                d.id, method, d.name
            );
            group.setTools(tools);
            return group;
        });
    }
    groupsWithoutLayers = groupsWithoutLayers.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
    return groupForOrphans ? [groupForOrphans, ...groupsWithoutLayers, ...groupList] : [...groupsWithoutLayers, ...groupList];
};
