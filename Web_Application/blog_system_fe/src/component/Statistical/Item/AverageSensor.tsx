import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  ArrowDown,
  ArrowUp,
  Broadcast,
  LightbulbFilament,
} from "@phosphor-icons/react";

export interface AverageSensorProps {
  diff?: number;
  trend: "up" | "down";
  sx?: SxProps;
  value: number;
}

export function AverageSensor({
  diff,
  trend,
  sx,
  value,
}: AverageSensorProps): React.JSX.Element {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor =
    trend === "up"
      ? "var(--mui-palette-success-main)"
      : "var(--mui-palette-error-main)";

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={3}>
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
            spacing={3}
          >
            <Stack spacing={1}>
              <Typography color="secondary" variant="overline">
                Average Light Sensor
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: "pink",
                height: "56px",
                width: "56px",
              }}
            >
              <Broadcast size={32} color="black" />
            </Avatar>
          </Stack>

          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <Typography
              color="grey"
              variant="caption"
              sx={{ fontSize: "1rem" }}
            >
              Average Light Sensor: <b>{value}</b>
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
