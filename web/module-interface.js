(() => {
  const prefix = 'saveforge:module:';
  const required = ['id', 'name', 'saveFiles', 'sessionFields'];
  const definitions = new Map();
  function define(definition) {
    for (const key of required) if (!definition[key]) throw new Error(`Module definition is missing ${key}.`);
    definitions.set(definition.id, Object.freeze({ ...definition }));
  }
  function saveImport(imported) {
    const definition = definitions.get(imported?.id);
    if (!definition) throw new Error('This package has no registered editor module.');
    const payload = {};
    for (const field of definition.sessionFields) {
      if (typeof imported[field] !== 'string') throw new Error(`Package is missing ${field}.`);
      payload[field] = imported[field];
    }
    sessionStorage.setItem(`${prefix}${definition.id}`, JSON.stringify(payload));
  }
  function loadImport(id) { const raw = sessionStorage.getItem(`${prefix}${id}`); return raw ? JSON.parse(raw) : null; }
  function clearImport(id) { sessionStorage.removeItem(`${prefix}${id}`); }
  window.SaveForgeModules = Object.freeze({ define, saveImport, loadImport, clearImport, definitions });
  define({ id: 'mcla', name: 'Midnight Club: Los Angeles', saveFiles: ['mc4.sav'], sessionFields: ['innerSave'] });
  define({ id: 'fable2', name: 'Fable II', saveFiles: ['herosave.bin', 'Fable2PubInfo.xml'], sessionFields: ['heroSave', 'publicInfo'] });
})();
