import { Typography, Box } from "@mui/material"
import { formatDistanceToNow } from "date-fns"
import { ja } from "date-fns/locale"
import { makeStyles } from "hooks/makeStyles"

const useStyles = makeStyles((theme) => ({
  timestamp: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    fontSize: "0.875rem",
  },
  empty: {
    color: theme.palette.text.secondary,
  },
}))

export const Timestamp = ({ datetime, prefix, sx }) => {
  const classes = useStyles()

  if (!datetime) return <Typography sx={{ ...classes.empty, ...sx }}>-</Typography>

  const date = new Date(datetime)
  const formattedDate = date.toLocaleString("ja-JP")
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ja })

  return (
    <Box component="span" sx={{ ...classes.timestamp, ...sx }}>
      <Typography component="span" variant="body2" title={formattedDate}>
        {timeAgo}
      </Typography>
    </Box>
  )
}

export const UpdatedAt = ({ updated_at, sx }) => {
  return <Timestamp datetime={updated_at} prefix="Updated" sx={sx} />
}
