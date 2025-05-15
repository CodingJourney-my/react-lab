import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  Skeleton,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material"
import { Refresh, FilterList, Search, MoreVert } from "@mui/icons-material"
import { UserLayout } from "components/layouts"
import { Timestamp, UpdatedAt } from "./Timestamp"
import { ResizableTableCell } from "./ResizableColumn"
import { useFetchRecordList } from "../hooks"
import { makeStyles } from "hooks/makeStyles"

// ローカルストレージのキー
const COLUMN_WIDTHS_STORAGE_KEY = "integration-records-column-widths"

// デフォルトのカラム設定
const DEFAULT_COLUMNS = [
  { id: "id", label: "ID", width: 80, minWidth: 50 },
  { id: "provider", label: "Provider", width: 150, minWidth: 100 },
  { id: "status", label: "Status", width: 120, minWidth: 100 },
  { id: "error_message", label: "Error Message", width: 200, minWidth: 150 },
  { id: "requested_at", label: "Requested At", width: 180, minWidth: 150 },
  { id: "completed_at", label: "Completed At", width: 180, minWidth: 150 },
  { id: "updated_at", label: "Updated At", width: 180, minWidth: 150 },
]

// ステータスに応じた色を返す関数
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "succeeded":
      return "success"
    case "failed":
      return "error"
    case "error":
      return "error"
    default:
      return "default"
  }
}

// プロバイダーに応じた表示名を返す関数
const getProvider = (provider) => {
  switch (provider?.toLowerCase()) {
    case "knowledge_mixer":
      return "KnowledgeMixer"
    default:
      return provider
  }
}

// スケルトンローダーコンポーネント
const TableSkeleton = ({ columns }) => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          {columns.map((column) => (
            <TableCell key={column.id} sx={{ width: `${column.width}px`, minWidth: `${column.minWidth || 50}px` }}>
              <Skeleton animation="wave" height={24} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

const RecordList = () => {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [columns, setColumns] = useState(DEFAULT_COLUMNS)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)

  const {
    data: records,
    isLoading,
    error,
    total,
    reload,
  } = useFetchRecordList({
    page,
    limit: rowsPerPage,
  })

  // ローカルストレージからカラム幅の設定を読み込む
  useEffect(() => {
    try {
      const savedWidths = localStorage.getItem(COLUMN_WIDTHS_STORAGE_KEY)
      if (savedWidths) {
        const parsedWidths = JSON.parse(savedWidths)
        setColumns((prevColumns) =>
          prevColumns.map((column) => ({
            ...column,
            width: parsedWidths[column.id] || column.width,
          })),
        )
      }
    } catch (e) {
      console.error("Failed to load column widths from localStorage:", e)
    }
  }, [])

  // カラム幅の変更を処理する関数
  const handleColumnResize = (index, newWidth) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns]
      newColumns[index] = { ...newColumns[index], width: newWidth }

      // ローカルストレージに保存
      try {
        const widthsObject = newColumns.reduce((acc, column) => ({ ...acc, [column.id]: column.width }), {})
        localStorage.setItem(COLUMN_WIDTHS_STORAGE_KEY, JSON.stringify(widthsObject))
      } catch (e) {
        console.error("Failed to save column widths to localStorage:", e)
      }

      return newColumns
    })
  }

  // 設定ダイアログでのカラム幅変更
  const handleColumnWidthChange = (columnId, width) => {
    setColumns((prevColumns) => prevColumns.map((column) => (column.id === columnId ? { ...column, width } : column)))
  }

  // 設定ダイアログを閉じるときにローカルストレージに保存
  const handleCloseSettings = () => {
    setSettingsDialogOpen(false)

    try {
      const widthsObject = columns.reduce((acc, column) => ({ ...acc, [column.id]: column.width }), {})
      localStorage.setItem(COLUMN_WIDTHS_STORAGE_KEY, JSON.stringify(widthsObject))
    } catch (e) {
      console.error("Failed to save column widths to localStorage:", e)
    }
  }

  // カラム設定をリセット
  const handleResetColumns = () => {
    setColumns(DEFAULT_COLUMNS)
    localStorage.removeItem(COLUMN_WIDTHS_STORAGE_KEY)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRefresh = () => {
    if (reload) {
      reload()
    }
  }

  return (
    <UserLayout>
      <Box sx={classes.root}>
        <Card sx={classes.card}>
          <CardContent sx={classes.cardContent}>
            {/* ヘッダー部分 */}
            <Box sx={classes.header}>
              <Typography variant="h5" component="h1" sx={classes.title}>
                外部サービス連携記録一覧
              </Typography>
              <Stack direction="row" spacing={1}>
                {/* <Tooltip title="検索">
                  <IconButton size="small">
                    <Search />
                  </IconButton>
                </Tooltip>
                <Tooltip title="フィルター">
                  <IconButton size="small">
                    <FilterList />
                  </IconButton>
                </Tooltip> */}
                <Tooltip title="更新">
                  <IconButton size="small" onClick={handleRefresh}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="その他">
                  <IconButton size="small">
                    <MoreVert />
                  </IconButton>
                </Tooltip> */}
              </Stack>
            </Box>

            <Divider />

            {/* エラー表示 */}
            {error && (
              <Box sx={{ p: 2 }}>
                <Alert
                  severity="error"
                  variant="filled"
                  action={
                    <IconButton color="inherit" size="small" onClick={handleRefresh}>
                      <Refresh />
                    </IconButton>
                  }
                >
                  <AlertTitle>エラー</AlertTitle>
                  データの取得に失敗しました。再度お試しください。
                </Alert>
              </Box>
            )}

            {/* テーブル部分 */}
            <TableContainer sx={classes.tableContainer}>
              <Table size="medium" sx={classes.table}>
                <TableHead>
                  <TableRow sx={classes.tableHead}>
                    {columns.map((column, index) => (
                      <ResizableTableCell
                        key={column.id}
                        width={column.width}
                        minWidth={column.minWidth}
                        onResize={(width) => handleColumnResize(index, width)}
                        index={index}
                        sx={classes.tableHeadCell}
                      >
                        {column.label}
                      </ResizableTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton columns={columns} />
                  ) : (
                    (records || []).map((row) => (
                      <TableRow key={row.id} hover sx={classes.tableRow}>
                        <TableCell sx={{ width: `${columns[0].width}px`, minWidth: `${columns[0].minWidth || 50}px` }}>
                          {row.id}
                        </TableCell>
                        <TableCell sx={{ width: `${columns[1].width}px`, minWidth: `${columns[1].minWidth || 50}px` }}>
                          <Chip label={getProvider(row.integration_provider)} size="small" variant="outlined" color="primary" />
                        </TableCell>
                        <TableCell sx={{ width: `${columns[2].width}px`, minWidth: `${columns[2].minWidth || 50}px` }}>
                          <Chip label={row.status} size="small" color={getStatusColor(row.status)} />
                        </TableCell>
                        <TableCell sx={{ width: `${columns[3].width}px`, minWidth: `${columns[3].minWidth || 50}px` }}>
                          {row.error_message ? (
                            <Tooltip title={row.error_message}>
                              <Typography variant="body2" sx={classes.errorMessage}>
                                {row.error_message}
                              </Typography>
                            </Tooltip>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ width: `${columns[4].width}px`, minWidth: `${columns[4].minWidth || 50}px` }}>
                          <Timestamp datetime={row.requested_at} prefix={"Requested"} sx={classes.timestampWrapper}/>
                        </TableCell>
                        <TableCell sx={{ width: `${columns[5].width}px`, minWidth: `${columns[5].minWidth || 50}px` }}>
                          <Timestamp datetime={row.completed_at} prefix={"Completed"} sx={classes.timestampWrapper}/>
                        </TableCell>
                        <TableCell sx={{ width: `${columns[6].width}px`, minWidth: `${columns[6].minWidth || 50}px` }}>
                          <UpdatedAt {...row} sx={classes.timestampWrapper}/>
                        </TableCell>
                      </TableRow>
                    ))
                  )}

                  {!isLoading && (!records || records.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={columns.length} sx={classes.emptyMessage}>
                        <Typography variant="body1">データがありません</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* ページネーション */}
            <Box sx={classes.pagination}>
              <TablePagination
                component="div"
                count={total || 0}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50, 100]}
                labelRowsPerPage="表示件数:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count !== -1 ? count : `${to}以上`}`}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* カラム設定ダイアログ */}
      {/* <ColumnSettingsDialog
        open={settingsDialogOpen}
        onClose={handleCloseSettings}
        columns={columns}
        onColumnWidthChange={handleColumnWidthChange}
        onReset={handleResetColumns}
      /> */}
    </UserLayout>
  )
}

// makeStylesを使用したスタイル定義
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  card: {
    boxShadow: theme.shadows[2],
  },
  cardContent: {
    padding: 0,
  },
  header: {
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  tableContainer: {
    overflow: "auto",
  },
  table: {
    tableLayout: "fixed",
  },
  tableHead: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  tableHeadCell: {
    fontWeight: "bold",
  },
  tableRow: {
    cursor: "pointer",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&:nth-of-type(odd)": {
      backgroundColor: "rgba(0, 0, 0, 0.02)",
    },
  },
  errorMessage: {
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: theme.palette.error.main,
  },
  emptyMessage: {
    padding: theme.spacing(4, 0),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  pagination: {
    borderTop: "1px solid rgba(224, 224, 224, 1)",
    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
      margin: 0,
    },
  },
  timestampWrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    fontSize: "0.875rem",
  },
}))

export default RecordList