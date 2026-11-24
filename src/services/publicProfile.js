'use strict';

// Only these fields may appear on the public page and the phone card.
// Work email and phone are public by decision (used for work contact).
// Notes, attachment and internal flags are never included.
function toPublicProfile(view) {
  return {
    id: view.id,
    title: view.title,
    fullName: view.fullName,
    position: view.position,
    startDate: view.startDate,
    endDate: view.endDate,
    avatarUrl: view.avatarUrl || null,
    email: view.email || null,
    phone: view.phone || null,
    collaborating: !view.archived && view.status !== 'ended',
  };
}

module.exports = { toPublicProfile };
