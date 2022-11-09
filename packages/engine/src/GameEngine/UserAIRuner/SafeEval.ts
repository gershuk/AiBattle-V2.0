import { AbstractController } from "./AbstractController";

export function RunEval(input:string) {
    return eval(input);
}

function ValidateController(controller:AbstractController) {
    try {
        return controller.Init != null &&
            controller.Init != undefined &&
            typeof controller.Init === 'function' &&
            controller.GetCommand != null &&
            controller.GetCommand != undefined &&
            typeof controller.GetCommand === 'function';
    } catch (error) {
        alert(error);
        return false;
    }
}

export function LoadControllerFromString(input:string) {
    const controller = RunEval(input);
    if (!ValidateController(controller)) {
        throw "Controller broken";
    }
    return { controllerObj: controller, text: input };
}