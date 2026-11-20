const fileInput = document.querySelector('#save-file');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const files = document.querySelector('#files');
const packageName = document.querySelector('#package-name');
const moduleStatus = document.querySelector('#module-status');
const openMcla = document.querySelector('#open-mcla');
const openFable2 = document.querySelector('#open-fable2');

fileInput.addEventListener('change', async () => {
  const [file] = fileInput.files;
  if (!file) return;
  status.textContent = `Inspecting ${file.name} locally…`;
  result.classList.add('hidden');
  try {
    const response = await fetch('/api/inspect', { method: 'POST', body: await file.arrayBuffer() });
    const inspection = await response.json();
    if (!response.ok) throw new Error(inspection.error);
    packageName.textContent = `${file.name} · ${inspection.magic} package`;
    files.replaceChildren(...inspection.files.map((entry) => {
      const item = document.createElement('li');
      item.textContent = `${entry.path} (${entry.size.toLocaleString()} bytes)`;
      return item;
    }));
    if (inspection.module?.id === 'mcla') {
      SaveForgeModules.saveImport(inspection.module);
      moduleStatus.textContent = 'Midnight Club: Los Angeles detected. Its inner mc4.sav is ready to edit.';
      openMcla.classList.remove('hidden');
      openFable2.classList.add('hidden');
    } else if (inspection.module?.id === 'fable2') {
      SaveForgeModules.saveImport(inspection.module);
      moduleStatus.textContent = 'Fable II detected. Its hero and public-info saves are ready to inspect.';
      openFable2.classList.remove('hidden');
      openMcla.classList.add('hidden');
    } else {
      moduleStatus.textContent = 'No game-specific editor is available for this package yet.';
      openMcla.classList.add('hidden');
      openFable2.classList.add('hidden');
    }
    result.classList.remove('hidden');
    status.textContent = 'Import complete. The original file has not been changed.';
  } catch (error) {
    status.textContent = error.message || 'Import failed.';
  }
});

openMcla.addEventListener('click', () => { window.location.href = '/mcla.html'; });
openFable2.addEventListener('click', () => { window.location.href = '/fable2.html'; });
