import { useStore } from "../contexts/store";

export function getContributions() {
    const [state] = useStore();
    return state.contributions;
}
export function getContribution(id: string) {
    const [state] = useStore();
    return state.contributions.find((contribution) => (contribution.id == id));
}
export function getContributionsByEvent(id: string) {
    const [state] = useStore();
    return state.contributions.find((contribution) => (contribution.eventId == id));
}
