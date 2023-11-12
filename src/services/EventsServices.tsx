import { useStore } from "../contexts/store";

export function getEvents() {
    const [state] = useStore();
    return state.events;
}
export function getEvent(id: string) {
    const [state] = useStore();
    return state.events.find((event) => (event.id == id));
}

export function getEventsByUser(id: string) {
    const [state] = useStore();
    return state.events.filter((event) => (event.userId == id));
}