import React, { useEffect, useState } from "react";
import "./App.css";
import { LineChart } from "@mui/x-charts";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  Snackbar,
  Switch,
  TextField,
} from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSocket } from "./api/useSocket";
import axios from "./axios";
import { ModeEnum } from "./types/enums/mode.enum";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { RetationEnum } from "./types/enums/retation.enum";
import { RetationDayEnum } from "./types/enums/relation-day.enum";
import Table from "@mui/material/Table";
import { TablePlants } from "./components/table.component";

const style = {
  position: "absolute" as "absolute",
  overflow: "scroll",
  overflowX: "hidden",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 800,
  bgcolor: "background.paper",
  backgroundClip: "padding-box",
  borderRadius: 10,
  boxShadow: 24,
  p: 4,
};

interface IData {
  date: Date;
  value: number;
}

interface IsWater {
  isWater: boolean;
}

interface IData {
  date: Date;
  value: number;
}

interface IDataResponse {
  time: Date;
  temperature: number;
  moisture: number;
}

interface IDataManualMode {
  turn_on_simple_water: boolean;
  turn_on_organic_water: boolean;
  turn_on_bulb: boolean;
}

export interface IRoutine {
  id?: string;
  title: string;

  description: string;

  time_of_start: Dayjs | null;

  time_of_start_hours?: number;

  time_of_start_minutes?: number;

  retation: RetationEnum;

  retation_day: RetationDayEnum;

  duration_bulb: number;

  humidity_target: number;

  duration_simple: number;

  duration_organic: number;
}

export interface IRoutineList extends IRoutine {
  is_selected?: boolean;
  mode?: ModeEnum;
}

interface ISetupTodo extends IDataManualMode {
  mode: ModeEnum;
}

interface ISetupRoutineAndMode {
  id: string;
  mode: ModeEnum;
}

const setup = async (data: ISetupTodo): Promise<void> => {
  await axios.post("mode", data);
};

const createRoutine = async (data: IRoutine): Promise<void> => {
  delete data.id;
  await axios.post("/routine/create", data);
};

const updateRoutine = async (data: IRoutineList): Promise<void> => {
  await axios.put("/routine/update", data);
};

const deleteRoutine = async (id: string): Promise<void> => {
  await axios.delete(`/routine/${id}`);
};

const selectModeAndRoutine = async (
  data: ISetupRoutineAndMode
): Promise<void> => {
  await axios.put("/routine/select-routine", data);
};
const initialSetupCreateState = {
  id: "",
  title: "",

  retation: RetationEnum.MONTH,

  retation_day: RetationDayEnum.MONDAY,

  description: "",

  time_of_start: null,

  duration_bulb: 0,

  humidity_target: 0,

  duration_simple: 0,

  duration_organic: 0,
};
function App() {
  const socket = useSocket();
  const [open, setOpen] = React.useState({ isUpdate: false, open: false });
  const handleOpen = (isUpdate: boolean = false) =>
    setOpen({ isUpdate, open: true });
  const handleClose = () => setOpen((el) => ({ ...el, open: false }));

  const [routine, setRoutine] = useState<IRoutine>(initialSetupCreateState);

  const [mode, setMode] = useState<ModeEnum>(ModeEnum.AUTO);

  const [manualMode, setManualMode] = useState<IDataManualMode>({
    turn_on_simple_water: false,
    turn_on_organic_water: false,
    turn_on_bulb: false,
  });

  const [selectedRoutine, setSelectedRoutine] = useState<IRoutineList | null>(
    null
  );

  const [routines, setRoutines] = useState<IRoutineList[]>([]);
  const [isWater, setWater] = useState<boolean>(true);
  const [tmp, setTmp] = useState<IData[]>([]);
  const [moisture, setMoisture] = useState<IData[]>([]);

  const { mutateAsync: mutateRoutine } = useMutation({
    mutationFn: (data: IRoutine) => createRoutine(data),
  });
  const { mutateAsync: mutateRoutineUpdate } = useMutation({
    mutationFn: (data: IRoutineList) => updateRoutine(data),
  });
  const { mutateAsync: mutateDeleteRoutine } = useMutation({
    mutationFn: (id: string) => deleteRoutine(id),
  });

  const { mutate: mutateSelectModeAndRoutine } = useMutation({
    mutationFn: (data: ISetupRoutineAndMode) => selectModeAndRoutine(data),
  });

  const { mutate } = useMutation({
    mutationFn: (data: ISetupTodo) => setup(data),
  });

  const handleDelete = async (id: string) => {
    await mutateDeleteRoutine(id);
    await refetchRoutines();
  };

  const handleEdit = async (routine?: IRoutineList) => {
    console.log("routine", routine);
    if (routine) {
      setRoutine(routine);
      handleOpen(true);
    }
  };
  const handleAdd = () => handleOpen(false);

  const {
    isLoading,
    isError,
    data: sensorsData,
    error,
  } = useQuery({
    queryKey: ["sensors"],
    queryFn: async (): Promise<IDataResponse[]> => {
      const data = await axios.get("list/sensors");

      const dataTmp: IData[] = data.data.map((el: IDataResponse) => ({
        date: new Date(el.time),
        value: el.temperature,
      }));
      const dataMoisture: IData[] = data.data.map((el: IDataResponse) => ({
        date: new Date(el.time),
        value: el.moisture,
      }));
      console.log("sensorsData2", data.data);
      setTmp(dataTmp);
      setMoisture(dataMoisture);
      return data.data;
    },
  });

  const {
    isLoading: isLoadingRoutine,
    data: listOfRoutine,
    refetch: refetchRoutines,
  } = useQuery({
    queryKey: ["routine/list"],
    queryFn: async (): Promise<IRoutineList[]> => {
      const data = await axios.get("routine/list");

      return data.data;
    },
  });
  useEffect(() => {
    if (listOfRoutine) {
      setRoutines(listOfRoutine);

      const selectedRoutine = listOfRoutine.find((el) => el.is_selected);

      setSelectedRoutine(selectedRoutine || null);
      setMode(selectedRoutine?.mode || ModeEnum.AUTO);
    }
  }, [isLoadingRoutine, listOfRoutine]);
  useEffect(() => {
    if (socket) {
      socket.on("notification-water-level", (data) => {
        let parsedData: IsWater = JSON.parse(data);
        setWater(parsedData.isWater);
      });

      socket.on("notification-tmp", (data) => {
        let parsedData: IData = JSON.parse(data);
        const date = new Date(parsedData.date);
        parsedData = {
          ...parsedData,
          date: date,
        };
        setTmp((prevMessages: IData[]) => [...prevMessages, parsedData]);
      });
      socket.on("notification-moisture", (data) => {
        let parsedData: IData = JSON.parse(data);
        const date = new Date(parsedData.date);
        parsedData = {
          ...parsedData,
          date: date,
        };
        setMoisture((prevMessages: IData[]) => [...prevMessages, parsedData]);
      });
    }

    return () => {
      if (socket) {
        socket.off("notification-water-level");
        socket.off("notification-moisture");
        socket.off("notification-moisture");
      }
    };
  }, [socket]);

  const manualModeStart = async (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    const data: ISetupTodo = {
      mode: mode,
      ...manualMode,
    };
    await mutate(data);
  };

  const applyModeAndRoutine = async (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (selectedRoutine && selectedRoutine.id) {
      const data: ISetupRoutineAndMode = {
        mode: mode,
        id: selectedRoutine.id,
      };
      await mutateSelectModeAndRoutine(data);
    }
  };

  const createSetup = async (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    routine.time_of_start_hours = routine.time_of_start?.hour();
    routine.time_of_start_minutes = routine.time_of_start?.minute();

    await mutateRoutine(routine);

    setRoutine(initialSetupCreateState);
    handleClose();
    await refetchRoutines();
  };

  const updateSetup = async (
    event: React.SyntheticEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    routine.time_of_start_hours = routine.time_of_start?.hour();
    routine.time_of_start_minutes = routine.time_of_start?.minute();

    await mutateRoutineUpdate(routine);

    setRoutine(initialSetupCreateState);
    handleClose();
    await refetchRoutines();
  };

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (isLoadingRoutine) {
    return <CircularProgress />;
  }

  // @ts-ignore
  return (
    <div>
      <Container>
        {isLoading ? (
          <Grid container spacing={2} height="40vh">
            <Grid
              height="40vh"
              item
              xs={6}
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Grid>
            <Grid
              item
              xs={6}
              height="40vh"
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box>
                <LineChart
                  xAxis={[
                    {
                      id: "Date",
                      label: "Date",
                      // min: data[0].date,
                      // max: data[data.length-1].date,
                      data: tmp.map((el) => el.date),
                      scaleType: "time",
                      valueFormatter: (date) =>
                        `${date.getFullYear().toString()}.${
                          date.getMonth() + 1
                        }.${date.getDate().toString()} - ${date
                          .getHours()
                          .toString()}.${date.getMinutes().toString()}.${date
                          .getSeconds()
                          .toString()}`,
                    },
                  ]}
                  series={[
                    {
                      label: "Temperature",
                      data: tmp.map((el) => el.value),
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box>
                <LineChart
                  xAxis={[
                    {
                      id: "Date",
                      label: "Date",
                      // min: data[0].date,
                      // max: data[data.length-1].date,
                      data: moisture.map((el) => el.date),
                      scaleType: "time",
                      valueFormatter: (date) =>
                        `${date.getFullYear().toString()}.${
                          date.getMonth() + 1
                        }.${date.getDate().toString()} - ${date
                          .getHours()
                          .toString()}.${date.getMinutes().toString()}.${date
                          .getSeconds()
                          .toString()}`,
                    },
                  ]}
                  series={[
                    {
                      label: "Moisture",
                      data: moisture.map((el) => el.value),
                    },
                  ]}
                  width={500}
                  height={300}
                />
              </Box>
            </Grid>
          </Grid>
        )}
        {/*{isWater ? "Water" : "No water"}*/}

        <Snackbar
          open={!isWater}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            Check water tanks!
          </Alert>
        </Snackbar>

        <Grid
          sx={{
            mt: 1,
            mb: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContext: "center",
          }}
        >
          <FormControl sx={{ width: 100 }}>
            <InputLabel color="primary" id="demo-simple-select-label">
              Mode
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={mode}
              input={<OutlinedInput label="Mode" />}
              onChange={(e) => {
                setMode(ModeEnum.parseToApi(e.target.value));
              }}
            >
              {[ModeEnum.AUTO, ModeEnum.MANUAL, ModeEnum.TIMER].map((el) => {
                return (
                  <MenuItem key={el} value={el}>
                    {ModeEnum.parseFromString(el)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {mode !== ModeEnum.MANUAL && (
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContext: "center",
              }}
            >
              <FormControl fullWidth sx={{ mr: 3, width: 200 }}>
                <InputLabel color="primary" id="demo-multiple-checkbox-label-4">
                  Select plant
                </InputLabel>
                <Select
                  value={selectedRoutine?.id ?? ""}
                  labelId="demo-multiple-checkbox-label-4"
                  id="demo-multiple-checkbox-label-4"
                  input={<OutlinedInput label="Select plant" />}
                  onChange={(e) => {
                    let routineToSelect = e.target.value;
                    const selectedRoutine = routines.find(
                      (el) => el.id == routineToSelect
                    );
                    if (selectedRoutine) {
                      setSelectedRoutine(selectedRoutine ?? null);
                    }
                  }}
                >
                  {routines.map((el) => {
                    return (
                      <MenuItem key={el.id} value={el.id}>
                        {el.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>

              <Button
                sx={{ mr: 3 }}
                variant={"contained"}
                onClick={applyModeAndRoutine}
              >
                Apply mode and plant
              </Button>
            </Container>
          )}
        </Grid>

        {mode === ModeEnum.MANUAL && (
          <Grid>
            <FormControlLabel
              checked={manualMode.turn_on_simple_water}
              label={"Turn simple water"}
              control={<Switch color="primary" />}
              onChange={(event: React.SyntheticEvent, checked: boolean) =>
                setManualMode({ ...manualMode, turn_on_simple_water: checked })
              }
              defaultChecked
              color="secondary"
            />
            <FormControlLabel
              checked={manualMode.turn_on_organic_water}
              label={"Turn organic water"}
              control={<Switch color="primary" />}
              onChange={(event: React.SyntheticEvent, checked: boolean) =>
                setManualMode({ ...manualMode, turn_on_organic_water: checked })
              }
              defaultChecked
              color="secondary"
            />
            <FormControlLabel
              checked={manualMode.turn_on_bulb}
              label={"Turn on bulb"}
              control={<Switch color="primary" />}
              onChange={(event: React.SyntheticEvent, checked: boolean) =>
                setManualMode({ ...manualMode, turn_on_bulb: checked })
              }
              defaultChecked
              color="secondary"
            />
            <Button variant={"contained"} onClick={manualModeStart}>
              Apply
            </Button>
          </Grid>
        )}
        <TablePlants
          rows={routines}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </Container>

      <Modal
        open={open.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            direction="column"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={3}
            item
            sx={{ w: 250 }}
          >
            <Grid item>
              <TextField
                id="outlined-basic"
                label="Title"
                sx={{ width: 250 }}
                variant="outlined"
                value={routine.title}
                onChange={(el) =>
                  setRoutine((routine) => ({
                    ...routine,
                    title: el.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item sx={{ w: 250 }}>
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                sx={{ width: 250 }}
                value={routine.description}
                onChange={(el) =>
                  setRoutine((routine) => ({
                    ...routine,
                    description: el.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item sx={{ w: 250 }}>
              <FormControl sx={{ m: 1, width: 250 }}>
                <InputLabel color="primary" id="demo-multiple-checkbox-label-3">
                  Repeat
                </InputLabel>
                <Select
                  value={routine.retation}
                  // label="Repeat day"
                  labelId="demo-multiple-checkbox-label-3"
                  id="demo-multiple-checkbox-label-3"
                  input={<OutlinedInput label="Repeat" />}
                  onChange={(e) => {
                    setRoutine((el) => ({
                      ...el,
                      retation: RetationEnum.parseToApi(e.target.value),
                    }));
                  }}
                >
                  {[
                    RetationEnum.DAY,
                    RetationEnum.WEEKEND,
                    RetationEnum.MONTH,
                  ].map((el) => {
                    return (
                      <MenuItem key={el} value={el}>
                        {RetationEnum.parseFromString(el)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            {routine.retation !== RetationEnum.DAY && (
              <Grid item sx={{ w: 250 }}>
                <FormControl sx={{ m: 1, width: 250 }}>
                  <InputLabel
                    color="primary"
                    id="demo-multiple-checkbox-label-1"
                  >
                    Repeat day
                  </InputLabel>
                  <Select
                    value={routine.retation_day}
                    // label="Repeat day"
                    labelId="demo-multiple-checkbox-label-1"
                    id="demo-multiple-checkbox-label-1"
                    input={<OutlinedInput label="Repeat day" />}
                    onChange={(e) => {
                      setRoutine((el) => ({
                        ...el,
                        retation_day: RetationDayEnum.parseToApi(
                          e.target.value
                        ),
                      }));
                    }}
                  >
                    {[
                      RetationDayEnum.MONDAY,
                      RetationDayEnum.TUESDAY,
                      RetationDayEnum.WEDNESDAY,
                      RetationDayEnum.THURSDAY,
                      RetationDayEnum.FRIDAY,
                      RetationDayEnum.SATURDAY,
                      RetationDayEnum.FRIDAY,
                    ].map((el) => {
                      return (
                        <MenuItem key={el} value={el}>
                          {RetationDayEnum.parseFromString(el)}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item sx={{ w: 250 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimeField
                  sx={{ width: 250 }}
                  id="outlined-basic"
                  label="At time"
                  variant="outlined"
                  format="HH:mm"
                  value={routine.time_of_start}
                  onChange={(value: Dayjs | null) =>
                    setRoutine((routine) => ({
                      ...routine,
                      time_of_start: value,
                    }))
                  }
                />
              </LocalizationProvider>
            </Grid>

            <Grid item sx={{ w: 250 }}>
              <TextField
                sx={{ width: 250 }}
                id="outlined-basic"
                label="Duration bulb (hours)"
                variant="outlined"
                type="number"
                value={routine.duration_bulb}
                onChange={(el) =>
                  setRoutine((routine) => ({
                    ...routine,
                    duration_bulb: Number(el.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item sx={{ w: 250 }}>
              <TextField
                sx={{ width: 250 }}
                id="outlined-basic"
                label="Humidity target"
                variant="outlined"
                type="number"
                value={routine.humidity_target}
                onChange={(el) =>
                  setRoutine((routine) => ({
                    ...routine,
                    humidity_target: Number(el.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item sx={{ w: 250 }}>
              <TextField
                id="outlined-basic"
                sx={{ width: 250 }}
                label="Time of pumping organic watter (20ml/m)"
                variant="outlined"
                type="number"
                value={routine.duration_organic}
                onChange={(el) =>
                  setRoutine((routine) => ({
                    ...routine,
                    duration_organic: Number(el.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item sx={{ w: 250 }}>
              <TextField
                id="outlined-basic"
                sx={{ width: 250 }}
                label="Time of pupming simple watter (20ml/m)"
                variant="outlined"
                type="number"
                value={routine.duration_simple}
                onChange={(el) =>
                  setRoutine((routine) => ({
                    ...routine,
                    duration_simple: Number(el.target.value),
                  }))
                }
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={open.isUpdate ? updateSetup : createSetup}
              >
                {open.isUpdate ? "Update setup" : "Create setup"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}

export default App;
