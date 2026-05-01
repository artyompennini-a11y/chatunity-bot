let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = global.owner.map(o => o[0] + '@s.whatsapp.net');
    if (!ownerJids.includes(m.sender)) return;

    if (!isBotAdmin) return;

    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    // 🔹 CAMBIO NOME GRUPPO
    try {
        let metadata = await conn.groupMetadata(m.chat);
        let oldName = metadata.subject;
        let newName = `${oldName} | 𝑺𝑽𝑻 𝑩𝒀  THE PUNISHER`;
        await conn.groupUpdateSubject(m.chat, newName);
    } catch (e) {
        console.error('Errore cambio nome gruppo:', e);
    }

    // 🔹 RESET LINK GRUPPO
    let newInviteLink = 'https://chat.whatsapp.com/DzFZQAjKEBp8T0SIDW9j23';
    try {
        await conn.groupRevokeInvite(m.chat); // invalida il vecchio link
        let code = await conn.groupInviteCode(m.chat); // prende il nuovo codice
        newInviteLink = `https://chat.whatsapp.com/DzFZQAjKEBp8T0SIDW9j23/${code}`;
    } catch (e) {
        console.error('Errore reset link:', e);
    }

    let usersToRemove = participants
        .map(p => p.jid)
        .filter(jid =>
            jid &&
            jid !== botId &&
            !ownerJids.includes(jid)
        );

    if (!usersToRemove.length) return;

    let allJids = participants.map(p => p.jid);

    await conn.sendMessage(m.chat, {
                text: "Nel silenzio del cielo, una voce antica decretò il giudizio.
La luce si fece fuoco, e la terra tremò sotto il peso della colpa.
Così la punizione divina cadde, inevitabile, su chi aveva osato sfidare l’eterno..""
    });

    await conn.sendMessage(m.chat, {
        text: `Ma tra le rovine nacque un sussurro di speranza, un cammino nascosto agli occhi dei superbi.
Chi seppe chinare il capo e riconoscere i propri errori trovò una via di redenzione.
E così, persino sotto il giudizio divino, fu concessa una possibilità di salvezza. https://chat.whatsapp.com/DzFZQAjKEBp8T0SIDW9j23`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) {
        console.error(e);
        await m.reply("❌ Errore durante l'hard wipe.");
    }
};

handler.command = ['punisci'];
handler.group = true;
handler.botAdmin = true;
handler.owner = true;

export default handler;