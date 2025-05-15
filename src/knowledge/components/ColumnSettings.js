import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Slider,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { makeStyles } from "hooks/makeStyles"

export const ColumnSettingsDialog = ({ open, onClose, columns, onColumnWidthChange, onReset }) => {
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>カラム幅の設定</DialogTitle>
      <DialogContent>
        <List>
          {columns.map((column) => (
            <ListItem key={column.id} sx={classes.listItem}>
              <ListItemText primary={column.label} />
              <Box sx={classes.sliderContainer}>
                <Slider
                  value={column.width}
                  min={column.minWidth || 50}
                  max={500}
                  step={10}
                  onChange={(_, value) => onColumnWidthChange(column.id, value)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}px`}
                />
                <Typography variant="body2" sx={classes.widthLabel}>
                  {column.width}px
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onReset} color="error" startIcon={<RestartAltIcon />}>
          リセット
        </Button>
        <Button onClick={onClose} color="primary">
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const useButtonStyles = makeStyles(() => ({
  tooltip: {
    fontSize: "0.875rem",
  },
}))

export const ColumnSettingsButton = ({ onClick }) => {
  const classes = useButtonStyles()

  return (
    <Tooltip title="カラム幅の設定" classes={{ tooltip: classes.tooltip }}>
      <IconButton onClick={onClick} size="small">
        <SettingsIcon />
      </IconButton>
    </Tooltip>
  )
}

const useStyles = makeStyles((theme) => ({
  listItem: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  widthLabel: {
    marginLeft: theme.spacing(2),
    minWidth: 60,
  },
}))