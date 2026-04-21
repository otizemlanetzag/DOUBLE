enum RemoteSensor {
    //% block="temperature"
    Temperature,
    //% block="light level"
    Light,
    //% block="sound level"
    Sound
}

//% color="#4b7bec" icon="\uf0c9" block="Double"
namespace double {
    let remoteValues: number[] = [0, 0, 0]
    let onReceivedHandler: () => void;

    /**
     * קביעת קבוצת הרדיו לתקשורת
     * @param id מספר הקבוצה (0-255), eg: 1
     */
    //% block="set radio group to %id"
    //% id.min=0 id.max=255
    export function setRadioGroup(id: number): void {
        radio.setGroup(id)
    }

    /**
     * משדר את כל הנתונים של המיקרוביט הנוכחי לרדיו
     */
    //% block="broadcast my sensors"
    export function broadcastSensors(): void {
        radio.sendValue("temp", input.temperature())
        radio.sendValue("light", input.lightLevel())
        radio.sendValue("sound", input.soundLevel())
    }

    radio.onReceivedValue(function (name, value) {
        if (name == "temp") remoteValues[RemoteSensor.Temperature] = value
        if (name == "light") remoteValues[RemoteSensor.Light] = value
        if (name == "sound") remoteValues[RemoteSensor.Sound] = value

        if (onReceivedHandler) {
            onReceivedHandler();
        }
    })

    /**
     * פועל כאשר מתקבל נתון חדש מהמיקרוביט השני
     */
    //% block="on data received"
    export function onDataReceived(handler: () => void) {
        onReceivedHandler = handler;
    }

    /**
     * מקבל את הערך שנשלח מהמיקרוביט השני
     */
    //% block="remote %sensor"
    export function getRemoteValue(sensor: RemoteSensor): number {
        return remoteValues[sensor]
    }
}
