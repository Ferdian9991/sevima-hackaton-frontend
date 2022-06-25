import React, { useState, useEffect, useRef } from "react";
import tw, { css } from "twin.macro";
import {
  useTable,
  useSortBy,
  usePagination,
  useFilters,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import { matchSorter } from "match-sorter";
import { CSVLink } from "react-csv";
import get from "lodash/get";
import { motion } from "framer-motion";

const Table = ({
  columns,
  customTopButton,
  data,
  loading,
  onAdd,
  onEdit,
  onWhatsapp,
  onAnswer,
  onAnswerList,
  onRemove,
  customAddButton,
  permanentDelete,
  onRestore,
  contentTrash,
  onGenerate,
  onExport,
  onAddParticipant,
  onRowClick,
  onFetchData,
  customUtilities,
  customHeaderButton,
  onChangeSelection,
  csvDownloaderConfig,
  withoutHeader,
  headerColumnColor,
  pageCount: controlledPageCount,
}) => {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const [filterVisible, setFilterVisible] = useState(false);

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    state,
    // visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
      manualPagination: !!onFetchData,
      pageCount: onFetchData ? controlledPageCount : pageCount,
      autoResetPage: !onFetchData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        let finalColumns = [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ];
        if (
          onEdit ||
          onAnswer ||
          onWhatsapp ||
          onAnswerList ||
          customUtilities ||
          onGenerate ||
          onAddParticipant
        ) {
          finalColumns.push({
            id: "options",
            Header: ({ getToggleAllRowsSelectedProps }) => <div></div>,
            style: {
              width: 80,
            },
            Cell: ({ row }) => (
              <div>
                <IndeterminateOptions
                  row={row}
                  onEdit={onEdit}
                  onAnswer={onAnswer}
                  onWhatsapp={onWhatsapp}
                  onAnswerList={onAnswerList}
                  onAddParticipant={onAddParticipant}
                  onGenerate={onGenerate}
                  customUtilities={customUtilities || []}
                />
              </div>
            ),
          });
        }
        return finalColumns;
      });
    }
  );

  if (onFetchData) {
    useEffect(() => {
      onFetchData({ pageIndex, pageSize });
    }, [onFetchData, pageIndex, pageSize]);
  }

  if (onChangeSelection) {
    useEffect(() => {
      // if (onChangeSelection) {
      onChangeSelection({ rows: selectedFlatRows.map((r) => r.original) });
      // }
    }, [selectedFlatRows.length]);
  }

  return (
    <>
      <div tw="flex justify-end pb-5 px-0 sm:px-5">
        <div>
          {customHeaderButton ? customHeaderButton : null}
          <button
            type="button"
            onClick={(e) => {
              if (e) e.preventDefault();
              setFilterVisible(!filterVisible);
            }}
            tw="h-9 w-9 text-white bg-gray-600 rounded-full shadow focus:outline-none mr-2"
          >
            <i className="fa fa-filter"></i>
          </button>
          {customTopButton ? <span>{customTopButton}</span> : null}
          {onRemove ? (
            <button
              type="button"
              tw="h-9 w-9 text-white bg-red-600 rounded-full shadow focus:outline-none mr-2"
              disabled={selectedFlatRows.length === 0}
              onClick={(e) => {
                if (e) e.preventDefault();
                if (onRemove) {
                  onRemove({
                    rows: selectedFlatRows.map((r) => r.original),
                  });
                }
              }}
            >
              <i className="fa fa-trash"></i>
            </button>
          ) : null}
          {onAdd ? (
            <button
              type="button"
              tw="h-9 w-9 text-white bg-green-500 rounded-full shadow focus:outline-none"
              onClick={onAdd}
            >
              <i className="fa fa-plus"></i>
            </button>
          ) : null}
        </div>
      </div>
      <div tw="rounded-md bg-white flex flex-row shadow-lg flex-wrap text-sm">
        {!withoutHeader ? (
          <div tw="px-6 py-4 w-full flex flex-col-reverse sm:flex-row flex-wrap">
            <div tw="w-full sm:w-2/3 flex flex-row items-center">
              {customAddButton ? (
                <div tw="w-1/2 sm:w-auto px-2 md:px-0 pr-0 md:pr-2">
                  {customAddButton}
                </div>
              ) : null}
              {csvDownloaderConfig ? (
                <div tw="w-1/2 sm:w-auto px-2 md:px-0 pr-0 md:pr-2">
                  <CSVDownloadButton
                    columns={columns}
                    rows={rows}
                    csvDownloaderConfig={csvDownloaderConfig}
                  />
                </div>
              ) : null}

              {permanentDelete ? (
                <button
                  tw="w-1/2 sm:w-auto bg-red-500 hover:bg-red-600 py-2 ml-0"
                  disabled={selectedFlatRows.length === 0}
                  onClick={(e) => {
                    if (e) e.preventDefault();
                    if (permanentDelete) {
                      permanentDelete({
                        rows: selectedFlatRows.map((r) => r.original),
                      });
                    }
                  }}
                >
                  <i className="fa fa-trash" tw="text-white" /> Hapus
                </button>
              ) : null}

              {contentTrash ? (
                <a
                  href="/content-trash"
                  tw="w-1/2 sm:w-auto bg-blue-400 hover:bg-blue-500 py-2 ml-3"
                  disabled={selectedFlatRows.length === 0}
                >
                  <i className="fas fa-recycle" tw="text-white" /> Sampah
                </a>
              ) : null}

              {onRestore ? (
                <button
                  tw="w-1/2 sm:w-auto bg-blue-400 hover:bg-blue-500 py-2 ml-3"
                  disabled={selectedFlatRows.length === 0}
                  onClick={(e) => {
                    if (e) e.preventDefault();
                    if (onRestore) {
                      onRestore({
                        rows: selectedFlatRows.map((r) => r.original),
                      });
                    }
                  }}
                >
                  <i className="fas fa-trash-restore" tw="text-white" />{" "}
                  Pulihkan
                </button>
              ) : null}
            </div>
            <div tw="w-full sm:w-1/3 mb-4 sm:mb-0">
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
                loading={loading}
              />
            </div>
          </div>
        ) : null}

        <div tw="w-full overflow-x-auto">
          <table
            {...getTableProps()}
            tw="w-full overflow-scroll md:overflow-x-hidden overflow-y-visible bg-blue-100"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, index) => {
                    const headerProps = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );

                    return (
                      <th
                        tw="pt-4 pb-3 px-6 font-bold text-white text-sm text-left border-b bg-cornflower-blue-500 text-white border-gray-200"
                        className={column.headerClassName || ""}
                        css={{
                          width:
                            column.id === "selection"
                              ? 20
                              : column.id === "options"
                              ? 50
                              : null,
                          paddingLeft:
                            column.id === "selection"
                              ? 25
                              : column.id === "options"
                              ? 10
                              : 25,
                          paddingRight:
                            column.id === "selection"
                              ? 10
                              : column.id === "options"
                              ? 25
                              : 25,
                          ...column.style,
                        }}
                        key={headerProps.key}
                      >
                        <div
                          {...headerProps}
                          tw="flex flex-row"
                          css={{
                            ...column.style,
                            ...headerProps.style,
                          }}
                        >
                          <div tw="whitespace-nowrap truncate">
                            {column.render("Header")}
                          </div>
                          {column.id === "selection" ||
                          column.id === "options" ||
                          !column.canFilter ? null : (
                            <div tw="text-white pl-2">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <i className="fa fa-sort-down" />
                                ) : (
                                  <i className="fa fa-sort-up" />
                                )
                              ) : (
                                <i className="fa fa-sort" />
                              )}
                            </div>
                          )}
                        </div>
                        {column.canFilter && filterVisible
                          ? column.render("Filter")
                          : null}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              tw="transition duration-500 "
              css={[loading && tw`hidden`]}
            >
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    onClick={(e) => {
                      if (e) {
                        if (
                          e.target.type === "checkbox" &&
                          e.target.title === "Toggle Row Selected"
                        ) {
                        } else if (onRowClick) {
                          e.preventDefault();
                          e.stopPropagation();
                          onRowClick({
                            ...e,
                            row,
                          });
                        }
                      }
                    }}
                    tw="transition duration-100 ease-linear border-b border-gray-300 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    {row.cells.map((cell) => (
                      <td
                        tw="py-5 px-6"
                        {...cell.getCellProps()}
                        css={{
                          width:
                            cell.column.id === "selection"
                              ? 20
                              : cell.column.id === "options"
                              ? 40
                              : null,
                          paddingLeft:
                            cell.column.id === "selection"
                              ? 25
                              : cell.column.id === "options"
                              ? 10
                              : 25,
                          paddingRight:
                            cell.column.id === "selection"
                              ? 10
                              : cell.column.id === "options"
                              ? 25
                              : 25,
                          ...cell.column.style,
                        }}
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {page.length === 0 ? (
          <div tw="w-full">
            <div tw="w-full text-center py-5 text-lg">Tidak ada data</div>
          </div>
        ) : null}
        <div tw="relative w-full">
          <div
            tw="absolute transition duration-500 bg-white opacity-100 w-full ease-in-out "
            css={[loading ? tw`visible` : tw`invisible`]}
          >
            <div tw="pt-6 pb-12 text-center">
              <div tw="text-xl text-gray-500 font-bold">
                <i className="fa fa-circle-notch fa-spin" /> SEDANG MEMUAT ...
              </div>
            </div>
          </div>
          <div tw="py-4 px-6 flex flex-row flex-wrap z-0">
            <div tw="w-full sm:w-1/3 text-center sm:text-left py-1">
              <label>Menuju halaman:</label>
              <input
                tw="rounded-md border-2 border-gray-300 ml-2 px-2 py-1 outline-none focus:border-apple-500"
                type="number"
                min="0"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                css={{ width: 70 }}
              />
            </div>
            <div tw="w-full flex justify-center items-center sm:w-1/3 text-center">
              <button
                tw="px-4 py-1 mr-2 hover:bg-gray-100"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                &nbsp;
                <i
                  className="fa fa-angle-left "
                  css={[
                    canPreviousPage ? tw`text-gray-500` : tw`text-gray-300`,
                  ]}
                />
                &nbsp;
              </button>
              <span>
                Halaman
                <strong>
                  {pageIndex + 1} dari{" "}
                  {onFetchData ? controlledPageCount : pageCount}
                </strong>
              </span>
              <button
                tw="px-4 py-1 ml-2 hover:bg-gray-100"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                &nbsp;
                <i
                  className="fa fa-angle-right "
                  css={[canNextPage ? tw`text-gray-500` : tw`text-gray-300`]}
                />
                &nbsp;
              </button>
            </div>
            <div tw="w-full sm:w-1/3 text-center sm:text-right py-1">
              <label>Menampilkan</label>
              &nbsp;
              <select
                tw="rounded-md border-2 border-gray-300 pl-4 py-1 focus:border-apple-500"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} baris
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    );
  }
);

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const IndeterminateOptions = (props) => {
  const ref = useRef();
  const [optionsVisible, setOptionsVisible] = useState(false);
  useOnClickOutside(ref, () => setOptionsVisible(false));

  return (
    <div tw="w-full flex flex-row flex-wrap">
      {props.onEdit ? (
        <button
          onClick={(e) => {
            if (e) {
              e.stopPropagation();
              e.preventDefault();
            }
            props.onEdit({ row: props.row.original });
            setOptionsVisible(false);
          }}
          tw="mb-1 bg-yellow-500 hover:bg-orange-600 mx-1 py-1 px-2 text-white focus:outline-none rounded-md"
        >
          <i className="fa fa-pencil-alt" tw="text-white" /> Edit
        </button>
      ) : null}
      {props.onAnswer ? (
        <button
          onClick={(e) => {
            if (e) {
              e.stopPropagation();
              e.preventDefault();
            }
            props.onAnswer({ row: props.row.original });
            setOptionsVisible(false);
          }}
          tw="mb-1 bg-green-500 hover:bg-green-600 w-[100px] mx-1 py-1 px-2 text-white focus:outline-none rounded-md"
        >
          <i className="fa-brands fa-readme" tw="text-white" /> Kerjakan
        </button>
      ) : null}
      {props.onWhatsapp ? (
        <button
          onClick={(e) => {
            if (e) {
              e.stopPropagation();
              e.preventDefault();
            }
            props.onWhatsapp({ row: props.row.original });
            setOptionsVisible(false);
          }}
          tw="mb-1 text-white bg-green-500 hover:bg-green-600 w-[100px] mx-1 py-1 px-2 text-white focus:outline-none rounded-md"
        >
          <i className="fa-solid fa-phone" tw="text-white" /> Whatsapp
        </button>
      ) : null}
      {props.onAnswerList ? (
        <button
          onClick={(e) => {
            if (e) {
              e.stopPropagation();
              e.preventDefault();
            }
            props.onAnswerList({ row: props.row.original });
            setOptionsVisible(false);
          }}
          tw="mb-1 bg-green-500 hover:bg-green-600 w-[100px] mx-1 py-1 px-2 text-white focus:outline-none rounded-md"
        >
          <i className="fa-solid fa-list-check" tw="text-white" /> Jawaban
        </button>
      ) : null}
      {props.onGenerate ? (
        <button
          onClick={(e) => {
            if (e) e.preventDefault();
            props.onGenerate({ row: props.row.original });
            setOptionsVisible(false);
          }}
          tw="mb-1 bg-green-400 hover:bg-green-500 mx-1 py-1 px-2 text-white focus:outline-none rounded-md"
        >
          <i className="fa fa-code " tw="text-white" /> Re-generate
        </button>
      ) : null}
      {props.onAddParticipant ? (
        <button
          onClick={(e) => {
            if (e) e.preventDefault();
            props.onAddParticipant({ row: props.row.original });
            setOptionsVisible(false);
          }}
          tw="mb-1 bg-blue-500 hover:bg-blue-600 mx-1 py-1 px-2 text-white focus:outline-none rounded-md"
        >
          <i tw="text-white" className="fa fa-users" /> Add Participant
        </button>
      ) : null}
      {props.customUtilities.map((utility, index) =>
        utility.render ? (
          <div key={index} tw="block hover:bg-gray-100">
            {utility.render(props)}
          </div>
        ) : (
          <a
            key={index}
            tw="block px-4 py-2 border-t bg-white hover:bg-gray-100"
            href="#"
            onClick={(e) => {
              if (e) e.preventDefault();
              if (utility.onClick) {
                utility.onClick({ ...e, ...props });
              }
              setOptionsVisible(false);
            }}
          >
            {utility.icon ? <span>{utility.icon} &nbsp;</span> : ""}
            {utility.label}
          </a>
        )
      )}
    </div>
  );
};

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  loading,
}) {
  const [state, setState] = useState("blur");
  // const count = preGlobalFilteredRows.length;

  return (
    <motion.div
      initial="blur"
      variants={{
        focus: {
          backgroundColor: "rgba(255, 255, 255)",
        },
        blur: {
          backgroundColor: "rgba(242, 244, 245)",
        },
      }}
      animate={state}
      onFocus={(e) => {
        setState("focus");
      }}
      onBlur={(e) => {
        setState("blur");
      }}
      tw="rounded-full border-2 border-gray-300 px-2 py-1 flex flex-row"
    >
      <div tw="py-1 px-2">
        <i
          tw="transition-all duration-500 transform "
          css={[
            state === "focus"
              ? tw`text-gray-800 scale-100`
              : tw`text-gray-600 scale-95`,
          ]}
          className={!loading ? `fa fa-search` : `fa fa-circle-notch fa-spin`}
        />
      </div>
      <input
        tw="outline-none py-1 px-1 flex-grow bg-transparent"
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={"Search"}
      />
    </motion.div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function DefaultColumnFilter({ column }) {
  const { filterValue, preFilteredRows, setFilter } = column;
  // const count = preFilteredRows.length;

  return (
    <div>
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        tw="rounded  text-black px-2 mt-1 py-1 w-full outline-none "
        className={column.headerClassName || ""}
        placeholder={"Filter " + column.Header}
      />
    </div>
  );
}

const CSVDownloadButton = ({ columns, rows, csvDownloaderConfig }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const newData = [
      [...columns.map((column) => column.Header)],
      ...rows.map((row) => {
        return columns.map((column) => {
          let value = get(row.original, column.accessor);
          if (column.csvFormatter) {
            value = column.csvFormatter({
              cell: {
                value,
              },
              row: row,
            });
          }
          return value;
        });
      }),
    ];
    setData(newData);
  }, [columns, rows, csvDownloaderConfig]);

  return (
    <CSVLink
      data={data}
      filename={csvDownloaderConfig.filename || "data.csv"}
      target="_blank"
      className={"btn-block btn-primary py-2 px-4"}
      separator={csvDownloaderConfig.separator || ","}
    >
      <i className="fa fa-download" /> Unduh CSV
    </CSVLink>
  );
};
