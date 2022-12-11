import './Phone.css'

const BASELINE = 160

export function Phone(attrs: any) {
    let { definition, fontScale } = attrs;
    let screenDpi = dpi()
    let zoom =  definition.ppi / screenDpi 
    let { width, height } = definition.size
    let realSize = definition.realSize()

    let phoneStyle = {
        width: `${width}px`,
        height: `${height}px`,
        zoom: 1 / zoom,
        fontSize: zoom + 'rem'
    }
    let fontStyle = { zoom: zoom * BASELINE / screenDpi * fontScale }

    const content = (
        <>
            <span style={{ fontSize: '14pt', lineHeight: `20pt`, ...fontStyle }}>Hello World! 14sp</span>
            <span style={{ fontSize: '16pt', lineHeight: '22pt', ...fontStyle }}>Hello World! 16sp</span>
            <span style={{ fontSize: '20pt', lineHeight: '27pt', ...fontStyle }}>Hello World! 20sp</span>
            <span style={{ fontSize: '24pt', lineHeight: '32pt', ...fontStyle }}>Hello World! 24sp</span>
        </>
    )

    return (
        <div className="PhoneFrame">
            <label>{definition.name} ({width.toFixed(0)} x {height.toFixed(0)} pixels / {realSize.width.toFixed(2)} x {realSize.height.toFixed(2)} inches)</label>
            <div className="Phone" style={phoneStyle}>
                {content}
            </div>
        </div>

    )
}

export class PhoneDef {

    constructor(
        public name: String,
        public size: WindowSize,
        public ppi: number
    ) {

    }
    realSize() {
        return this.size.measure(this.ppi)
    }
}

export class WindowSize {
    constructor(public width: number = 0, public height: number = 0) { }

    area(): number {
        return this.height * this.width;
    }

    scale(density: number): WindowSize {
        let { width, height } = this.measure(density)
        return new WindowSize(Math.floor(width), Math.floor(height))
    }

    measure(density: number): WindowSize {
        return new WindowSize(this.width / density, this.height / density)
    }
}



function dppx() {
    // devicePixelRatio: Webkit (Chrome/Android/Safari), Opera (Presto 2.8+), FF 18+
    return typeof window == 'undefined' ? 0 : +window.devicePixelRatio || 0
}

function dpi() {
    return dppx() * 96
}