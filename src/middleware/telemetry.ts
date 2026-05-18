import { NodeSDK } from "@opentelemetry/sdk-node";
import {getNodeAutoInstrumentations} from "@opentelemetry/auto-instrumentations-node";
import {OTLPTraceExporter} from "@opentelemetry/exporter-trace-otlp-http";
import {SimpleSpanProcessor,ConsoleSpanExporter} from "@opentelemetry/sdk-trace-base";
import { trace } from "@opentelemetry/api";

const tracer = trace.getTracer("my-tracer");
const traceExporter = new OTLPTraceExporter({
    url: "http://localhost:4318/v1/traces"
});

const sdk = new NodeSDK({
    spanProcessor: new SimpleSpanProcessor(
        new ConsoleSpanExporter()
    ),
    traceExporter,
    instrumentations: [
        getNodeAutoInstrumentations()
    ]

});

sdk.start();
console.log("Open Telemetry initialised");
export default tracer;