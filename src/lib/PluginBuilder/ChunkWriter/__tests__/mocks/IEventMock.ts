import { IEvent } from '../../../IEvent';

function getDefaults(): IEvent {
    return {
        name: 'someGenericEvent',
        description: 'A description of this event',
        dataType: 'bz_SomeGenericEvent_V1',
        since: '2.4.0',
        parameters: [],
    };
}

export const getIEventMock = (p?: Partial<IEvent>): IEvent => ({
    ...getDefaults(),
    ...p,
});
