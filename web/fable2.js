const $ = (selector) => document.querySelector(selector);
const abilities = ['Brutal Styles', 'Physique', 'Toughness', 'Dextrous Styles', 'Accuracy', 'Speed', 'Shock', 'Inferno', 'Time Control', 'Blades', 'Vortex', 'Chaos', 'Force Push', 'Raise Dead'];
const heroBytes = SaveForgeModules.loadImport('fable2')?.heroSave;
let documentXml;

function fromBase64(value) { return Uint8Array.from(atob(value), char => char.charCodeAt(0)); }
function toBase64(bytes) { return btoa(String.fromCharCode(...bytes)); }
function readXml(bytes) {
  const size = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0, true);
  if (size < 16 || size > bytes.byteLength - 4) throw new Error('The hero save does not contain a valid XML payload.');
  const xml = new TextDecoder('ascii').decode(bytes.subarray(4, 4 + size));
  const parsed = new DOMParser().parseFromString(xml, 'application/xml');
  if (parsed.querySelector('parsererror') || parsed.documentElement.nodeName !== 'HeroSave') throw new Error('The hero-save XML is invalid.');
  return parsed;
}
function value(name) { return documentXml.querySelector(name); }
function getNumber(name) { return Number(value(name)?.textContent?.trim().split(/\s+/)[0]); }
function floatHex(number) { const view = new DataView(new ArrayBuffer(4)); view.setFloat32(0, number, true); return [...new Uint8Array(view.buffer)].reverse().map(byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase(); }
function setValue(name, number, floating = false) { const node = value(name); if (!node || !Number.isFinite(number)) throw new Error(`Invalid ${name} value.`); node.textContent = floating ? `${number} ${floatHex(number)}` : String(Math.trunc(number)); }
function input(id, label, value, min = 0, max = 255) { const wrapper = document.createElement('label'); wrapper.textContent = label; const field = document.createElement('input'); field.type = 'number'; field.id = id; field.min = min; field.max = max; field.value = value; wrapper.append(field); return wrapper; }
function download() { const serialized = new XMLSerializer().serializeToString(documentXml); const xml = new TextEncoder().encode(serialized); const output = new Uint8Array(4 + xml.length); new DataView(output.buffer).setUint32(0, xml.length, true); output.set(xml, 4); const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([output], { type: 'application/octet-stream' })), download: 'herosave.bin' }); link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); }

try {
  if (!heroBytes) throw new Error('Import a Fable II package first.');
  documentXml = readXml(fromBase64(heroBytes));
  $('#gold').value = getNumber('Money'); $('#renown').value = getNumber('Renown'); $('#morality').value = getNumber('Morality'); $('#purity').value = getNumber('Purity');
  abilities.forEach((name, index) => $('#abilities').append(input(`ability-${index + 1}`, name, getNumber(`HeroAbility${index + 1}`))));
  $('#max-gold').onclick = () => { $('#gold').value = 999999999; };
  $('#good').onclick = () => { $('#morality').value = 1000; $('#purity').value = 1000; };
  $('#neutral').onclick = () => { $('#morality').value = 0; $('#purity').value = 0; };
  $('#bad').onclick = () => { $('#morality').value = -1000; $('#purity').value = -1000; };
  $('#max-abilities').onclick = () => abilities.forEach((_, index) => { $(`#ability-${index + 1}`).value = 255; });
  $('#download').onclick = () => { setValue('Money', Number($('#gold').value)); setValue('Renown', Number($('#renown').value)); setValue('Morality', Number($('#morality').value), true); setValue('Purity', Number($('#purity').value), true); abilities.forEach((_, index) => setValue(`HeroAbility${index + 1}`, Number($(`#ability-${index + 1}`).value))); download(); };
  $('#notice').textContent = 'Fable II hero save loaded. Changes remain in memory until download.';
  $('#empty').classList.add('hidden'); $('#editor').classList.remove('hidden');
} catch (error) { $('#empty').textContent = `Could not open this Fable II save: ${error.message}`; }
