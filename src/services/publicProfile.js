'use strict';

// Only these fields may appear on the public page and the phone card.
// Email, phone, notes, attachments and internal flags are never included.
function toPublicProfile(view) {
  return {
    id: view.id,
    title: view.title,
    fullName: view.fullName,
    position: view.position,
    startDate: view.startDate,
    endDate: view.endDate,
    collaborating: !view.archived && view.status !== 'ended',
  };
}

module.exports = { toPublicProfile };
