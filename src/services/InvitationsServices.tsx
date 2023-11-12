import { useStore } from "../contexts/store";

export function getInvitations() {
    const [state] = useStore();
    return state.invitations;
;
}
export function getInvitation(id: string) {
    const [state] = useStore();
    return state.invitations.find((invitation) => (invitation.id == id));
}

export function getInvitationsByEvent(id: string) {
    const [state] = useStore();
    return state.invitations.find((invitation) => (invitation.eventId == id));
}

export function getCanContributions(numeroTelephone: string) {
    const [state] = useStore();
    return state.invitations.filter((invitation) => (invitation.numeroTelephone == numeroTelephone && invitation.closeDonation==false));
}