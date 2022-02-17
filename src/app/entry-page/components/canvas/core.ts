import {Observable, Subject} from "rxjs";

declare type Point = {
    x: number;
    y: number;
}

function createCursor(context: CanvasRenderingContext2D, width: number, height: number) {
    const draw = ({x, y}: Point, lineWidth: number, color: string, angle: number) => {
        context.clearRect(0, 0, width, height);
        const v = [[0, -10 * lineWidth], [-10 * lineWidth, 10 * lineWidth], [10 * lineWidth, 10 * lineWidth]];
        context.save();
        context.translate(x, y);
        context.rotate(angle * Math.PI/180);
        context.beginPath();
        context.moveTo(v[0][0],v[0][1]);
        context.lineTo(v[1][0],v[1][1]);
        context.lineTo(v[2][0],v[2][1]);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
    }

    return {
        draw
    }
}

export function createCore (bottom: CanvasRenderingContext2D, top: CanvasRenderingContext2D, width: number, height: number) {
    const centerPosition = {x: Math.ceil(width / 2), y: Math.ceil(height / 2)};
    const defaultColor = '#e91e63';
    let writeMode = false;
    let angle = 0;
    let currentPosition = {...centerPosition};
    let lineWidth = 1;
    let color = defaultColor;
    const errors = new Subject<string | null>();

    const cursor = createCursor(top, width, height);
    bottom.lineWidth = lineWidth;

    const getErrors = (): Observable<string | null> => {
        return errors.asObservable();
    }

    const setColor = () => {
        top.strokeStyle = color;
        top.fillStyle = color;
        bottom.strokeStyle = color;
    }

    const center = () => {
        top.moveTo(centerPosition.x, centerPosition.y);
        bottom.moveTo(centerPosition.x, centerPosition.y);
        currentPosition = {...centerPosition};
    }

    const updatePosition = ({x, y} : {x?: number, y?: number}) => {
        if (x && (x + currentPosition.x) > 0 && (x + currentPosition.x) < width) {
            currentPosition.x += x;
        }
        if (y && y + currentPosition.y > 0 && y + currentPosition.y < height) {
            currentPosition.y += y;
        }
    }

    const calculatePosition = (target: Point, distance: number): Point => {
        const position = {...currentPosition};
        let x = Math.sin(angle * Math.PI / 180) * distance;
        let y = Math.cos(angle * Math.PI / 180) * distance;

        position.x = position.x + x;
        position.y = position.y - y;
        return position;
    }

    const executeNavigation = (x : number, y: number) => {
        if (writeMode) {
            bottom.save();
            bottom.beginPath();
            bottom.moveTo(currentPosition.x, currentPosition.y);
            bottom.lineTo(x, y);
            bottom.stroke();
            bottom.closePath();
            bottom.restore();
        } else {
            bottom.moveTo(x, y);
        }
    }

    const penwidth = function (args: string[]) {
        lineWidth = Number(args[0]);
        bottom.lineWidth = lineWidth;
    }

    const pencolor = (args: string[] | string) => {
        if (Array.isArray(args)) {
            const hexify = (value: number): string => {
                const hex = value.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }
            const r = hexify(Number(args[0]));
            const g = hexify(Number(args[1]));
            const b = hexify(Number(args[2]));
            color = `#${r}${g}${b}`;
        } else {
            color = args;
        }

        setColor()
    }

    const gox = (args: string[]) => {
        const x = Number(args[0]);
        updatePosition({x});
        cursor.draw(currentPosition, lineWidth, color, angle);
    }

    const goy = (args: string[]) => {
        const y = Number(args[0]);
        updatePosition({y});
        cursor.draw(currentPosition, lineWidth, color, angle);
    }

    const go = (args: string[]) => {
        const x = Number(args[0]);
        const y = Number(args[1]);
        const position = {...currentPosition};
        position.x += x;
        position.y += y;
        if (isPositionValid(position)) {
            updatePosition({x, y});
            cursor.draw(currentPosition, lineWidth, color, angle);
        }
    }

    const penspeed = (args: string[]) => {}

    const penup = () => {
        writeMode = false;
    }

    const pendown = () => {
        writeMode = true;
    }

    const forward = (args: string[]) => {
        const distance = Number(args[0]);
        const destination = calculatePosition(currentPosition, distance);
        if (isPositionValid(destination)) {
            executeNavigation(destination.x, destination.y);
            cursor.draw(destination, lineWidth, color, angle);
            currentPosition = {...destination};
        }
    }

    const backward = (args: string[]) => {
        const distance = Number(-args[0]);
        const destination = calculatePosition(currentPosition, distance);
        if (isPositionValid(destination)) {
            executeNavigation(destination.x, destination.y);
            cursor.draw(destination, lineWidth, color, angle);
            currentPosition = {...destination};
        }
    }

    const turnleft = (args: string[]) => {
        const degree = Number(args[0]);
        angle -= degree;
        angle = angle % 360;

        cursor.draw(currentPosition, lineWidth, color, angle);
    }

    const turnright = (args: string[]) => {
        const degree = Number(args[0]);
        angle += degree;
        angle = angle % 360;

        cursor.draw(currentPosition, lineWidth, color, angle);
    }

    const clear = () => {
        top.clearRect(0, 0, width, height);
        bottom.clearRect(0, 0, width, height);
        currentPosition = {...centerPosition};
        angle = 0;
        color = defaultColor;
        center();
        cursor.draw(currentPosition, lineWidth, color, angle);
    }

   const isPositionValid = ({x, y}: Point): boolean => {
        let isValid = false;
        if (x > width) {
            errors.next(`x exceeded, maximal x is ${width} and you requested ${x}`);
        } else if (x < 0) {
           errors.next(`x exceeded, minimal x is 0, and you requested ${x}`);
       } else if (y > height) {
           errors.next(`y exceeded, maximal y is ${height} and you requested ${y}`);
       } else if (y < 0) {
           errors.next(`y exceeded, minimal y is 0 and you requested ${x}`);
       } else {
            isValid = true
            errors.next(null);
        }
        return isValid;
   }

    center();
    pencolor(color);
    cursor.draw(currentPosition, lineWidth, color, angle);

    return {
        penwidth,
        pencolor,
        center,
        penup,
        gox,
        pendown,
        goy,
        forward,
        go,
        backward,
        turnleft,
        turnright,
        clear,
        getErrors
    }
}
