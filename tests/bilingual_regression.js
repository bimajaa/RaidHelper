const assert = require('node:assert/strict');
const {
  localizePayload,
  translateIdToEn,
  translateEnToId
} = require('../lib/i18n');
const {
  createParty,
  buildPartyComponents,
  buildNestSelect,
  buildNestModeSelect,
  RAID_NEST_OPTIONS
} = require('../lib/party');

const party = createParty({
  name: 'Test Party',
  nest: RAID_NEST_OPTIONS[2],
  nestMode: 'Hardcore',
  maxSlots: 8,
  creatorId: 'user-host',
  channelId: 'channel-1'
});

const idPayload = buildPartyComponents(party).map(x => x.toJSON());
const enPayload = localizePayload(idPayload, 'en');
const idRoundTrip = localizePayload(enPayload, 'id');

// Internal component values must NEVER be translated.
const originalValues = idPayload[0].components[0].options.map(o => o.value);
const enValues = enPayload[0].components[0].options.map(o => o.value);
assert.deepEqual(enValues, originalValues);

const nestPayload = buildNestSelect(party.id).toJSON();
const nestEn = localizePayload(nestPayload, 'en');
assert.deepEqual(
  nestEn.components[0].options.map(o => o.value),
  nestPayload.components[0].options.map(o => o.value)
);

const modePayload = buildNestModeSelect(party.id, party.nest).toJSON();
const modeCustomId = modePayload.components[0].custom_id;
const encodedNest = modeCustomId.split(':')[3];
assert.equal(Buffer.from(encodedNest, 'base64url').toString('utf8'), party.nest);
assert.deepEqual(
  modePayload.components[0].options.map(o => o.value),
  ['Normal', 'Classic', 'Hardcore']
);

assert.equal(translateIdToEn('Pilih Raid Nest:'), 'Select Raid Nest:');
assert.equal(translateEnToId('Close Party'), 'Tutup Party');

console.log('✅ Bilingual regression checks passed.');
console.log('✅ Select values are stable across locales.');
console.log('✅ Nest mode state is stored in customId, not localized message text.');
