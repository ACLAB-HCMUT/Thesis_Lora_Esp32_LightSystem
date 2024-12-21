"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import { alpha, useTheme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";
import { ArrowClockwise as ArrowClockwiseIcon } from "@phosphor-icons/react/dist/ssr/ArrowClockwise";
import Chart from "react-apexcharts";
import { MenuItem, Select } from "@mui/material";
import type { ApexOptions } from "apexcharts";

export interface DashboardSensorProps {
  chartSeries: { name: string; data: number[] }[];
  timestamps: string[];
  sx?: SxProps;
  deviceList: { id: string; name: string }[]; 
  selectedDevice: string; 
  onDeviceChange: (deviceId: string) => void; 
}

export function DashboardSensor({
  chartSeries,
  timestamps,
  sx,
  deviceList,
  selectedDevice,
  onDeviceChange,
}: DashboardSensorProps): React.JSX.Element {
  const chartOptions = useChartOptions(timestamps);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<ArrowClockwiseIcon fontSize="36" />}
          >
            Sync
          </Button>
        }
        title="Dashboard Sensor"
      />
      <CardContent>
        <Chart
          height={350}
          options={chartOptions}
          series={chartSeries}
          type="bar"
          width="100%"
        />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Select
          value={selectedDevice}
          onChange={(e) => onDeviceChange(e.target.value)}
          size="small"
          displayEmpty
          style={{ width: 150 }}
        >
          <MenuItem value="">Select Device</MenuItem>
          {deviceList.map((device) => (
            <MenuItem key={device.id} value={device.id}>
              {device.name}
            </MenuItem>
          ))}
        </Select>
      </CardActions>
    </Card>
  );
}

function useChartOptions(timestamps: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: {
      background: "transparent",
      stacked: false,
      toolbar: { show: false },
      zoom: {
        enabled: true,
        type: "xy",
      },
    },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.25),
    ],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: "solid" },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: "40px" } },
    stroke: { colors: ["transparent"], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: timestamps,
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`),
        offsetX: -5,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
