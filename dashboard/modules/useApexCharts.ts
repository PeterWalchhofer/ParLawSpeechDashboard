import { useEffect, useRef } from "react";
const getApexCharts = async() => (await import("apexcharts")).default;


export const useApexChart = (options: ApexCharts.ApexOptions) => {

  const elRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexCharts>();
  const prevOptions = useRef<ApexCharts.ApexOptions>();

  useEffect(() => {
    const a = getApexCharts().then((ApexCharts) => {
    chartRef.current = new ApexCharts(elRef.current!, options);
    console.log(chartRef.current)
    chartRef.current.render();
    prevOptions.current = options;
    })
    return () => {
      console.log("rem")
      chartRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    const { chart, ...opts } = options!;
    console.log(chartRef.current)
    console.log(chart?.selection)
    chartRef.current?.updateOptions(options);
  }, [options]);

  return { elRef };
};