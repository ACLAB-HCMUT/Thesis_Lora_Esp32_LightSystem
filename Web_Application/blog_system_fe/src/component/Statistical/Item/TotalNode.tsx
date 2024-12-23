import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import type { SxProps } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { LightbulbFilament } from "@phosphor-icons/react";
export interface TotalProps {
  diff?: number;
  trend: "up" | "down";
  sx?: SxProps;
  value: number;
}

export function Total({
  diff,
  trend,
  sx,
  value,
}: TotalProps): React.JSX.Element {
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
                Total Node
              </Typography>
              <Typography variant="h4">{value}</Typography>
            </Stack>
            <Avatar
              sx={{
                backgroundColor: "yellow",
                height: "56px",
                width: "56px",
              }}
            >
              <LightbulbFilament size={32} />
            </Avatar>
          </Stack>
          {diff !== undefined ? (
            <Stack sx={{ alignItems: "center" }} direction="row" spacing={2}>
              <Typography
                color="grey"
                variant="caption"
                sx={{ fontSize: "1rem" }}
              >
                NODE IN SYSTEM: <b>{value}</b>
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
