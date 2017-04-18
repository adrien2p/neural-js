import uuid from 'uuid';

export default class Connection {
    constructor(from, to) {
        this.id = uuid.v4();
        this.from = from;
        this.to = to;
        this.weight = 0;
        this.activation = 0;
    }

    toJSON() {
        return {
            id: this.id,
            from: this.from.toJSON(true),
            to: this.to.toJSON(true),
            weight: this.weight,
            activation: this.activation
        };
    }
}
