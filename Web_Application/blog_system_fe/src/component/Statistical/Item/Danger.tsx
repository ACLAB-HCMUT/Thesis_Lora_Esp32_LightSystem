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
  Warning,
} from "@phosphor-icons/react";

export interface DangerProps {
  diff?: number;
  trend: "up" | "down";
  sx?: SxProps;
  value: [];
}

export function Danger({
  diff,
  trend,
  sx,
  value,
}: DangerProps): React.JSX.Element {
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
                Danger Node
              </Typography>
              <Typography variant="h4">{value.length}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: "red",
                height: "56px",
                width: "56px",
              }}
            >
              <Warning size={32} color="white" />
            </Avatar>
          </Stack>

          <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
            <Typography
              color="grey"
              variant="caption"
              sx={{ fontSize: "1rem" }}
            >
              Missing data from node: <b>{value.join(", ")}</b>
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
