import { Box, Container, createTheme, FormControl, MenuItem, Select, Slider, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import './App.css';
import { Phone, PhoneDef, WindowSize } from './Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextFields, ZoomOutMap } from '@mui/icons-material';
import { blueGrey, grey } from '@mui/material/colors';
import { ThemeProvider } from '@mui/system';


const theme = createTheme({
  palette: {
    primary: blueGrey
  }
})

function App() {

  let pixel1 = new PhoneDef("Pixel 1", new WindowSize(1080, 1920), 441)
  let nexus5x = new PhoneDef("Nexus 5X", new WindowSize(1080, 1920), 424)
  let pixel4a = new PhoneDef("Pixel 4a", new WindowSize(1080, 2340), 444)
  let galaxyA32SM326 = new PhoneDef("Galaxy A32 5G", new WindowSize(720, 1600), 269)
  let galaxyA32SM325 = new PhoneDef("Galaxy A32", new WindowSize(1080, 2400), 412)

  let [availablePhones, setAvailablePhones] = useState([pixel1, pixel4a, galaxyA32SM326, galaxyA32SM325, nexus5x])
  let [phones, setPhones] = useState([] as PhoneDef[])
  let [zoomLevel, setZoomLevel] = useState(75)
  const handleZoom = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setZoomLevel(newValue);
    }
  };
  let [fontScale, setFontScale] = useState(1)
  const handleFontScale = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setFontScale(newValue);
    }
  };

  const handleAddDevice = (event: any) => {
    let item = availablePhones[event.target.value]
    let newList = Array.from(new Set([...phones, item]))
    setPhones([...newList])
    event.target.selectedIndex = -1

  }

  const handleRemoveDevice = (phone: PhoneDef) => {
    let newList = phones.filter(it => it != phone)
    setPhones(newList)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} disableGutters sx={{ fontFamily: "Roboto" }}>
        <Stack height="100vh">
          <Box sx={{ backgroundColor: 'primary.dark', px: 2 }}>
            <Stack direction="row" height="8vh" alignItems="center">
              <Typography sx={{ width: 1 / 8, color: 'primary.light' }} variant="h4">Screen Match</Typography>
              <FormControl sx={{ width: 1 / 2 }}>
                <Select
                  defaultValue={-1}
                  value={-1}
                  onChange={handleAddDevice}
                  sx={{ color: 'primary.contrastText' }}
                >
                  <MenuItem value={-1}>Select a phone...</MenuItem>
                  {availablePhones.map((p, i) => (<MenuItem value={i}>{p.name}</MenuItem>))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 1 / 6, mx: 2 }}>
                <Typography id="zoom-label" sx={{ color: 'primary.contrastText' }}>Zoom</Typography>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                  <ZoomOutMap sx={{ color: 'primary.contrastText' }} />
                  <Slider
                    aria-labelledby="zoom-label"
                    defaultValue={zoomLevel}
                    valueLabelDisplay="auto"
                    marks
                    min={10}
                    max={200}
                    onChange={handleZoom}
                  />
                </Stack>
              </FormControl>
              <FormControl sx={{ width: 1 / 6, mx: 2 }}>
                <Typography id="font-scale-label" sx={{ color: 'primary.contrastText' }}>Font scale</Typography>
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                  <TextFields sx={{ color: 'primary.contrastText' }} />
                  <Slider
                    aria-labelledby="font-scale-label"
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    step={0.1}
                    marks
                    min={0.9}
                    max={1.2}
                    onChange={handleFontScale}
                  />
                </Stack>
              </FormControl>
            </Stack>
          </Box>
          <Stack direction="row" height="92vh" sx={{ backgroundColor: 'primary.light' }}>
            <div className='SideMenu'>
              <Stack direction="column">
                {phones.map((p: PhoneDef) => (
                  <Stack direction="row" sx={{ background: grey[600], borderRadius: '0.25rem', border: '1px solid ' + grey[700], alignItems: 'center', justifyContent: 'space-between', p: '0.25rem 0', pl: '0.5rem' }}>
                    <Typography sx={{ color: 'primary.contrastText', fontSize: '0.75rem' }}>{p.name}</Typography>
                    <DeleteIcon sx={{ color: 'primary.contrastText', height: '1rem' }} onClick={() => handleRemoveDevice(p)} />
                  </Stack>
                ))}
              </Stack>
            </div>
            <div className='Canvas' style={{ zoom: zoomLevel / 100 }}>
              {phones.map((p: PhoneDef) => (<Phone definition={p} fontScale={fontScale} />))}
            </div>
          </Stack>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
