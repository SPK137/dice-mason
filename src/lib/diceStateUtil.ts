import * as CANNON from "cannon-es";

export function initializeDiceState(diceBody: CANNON.Body) {
    return {
        body: diceBody,
        isSleeping: false,
    }
}