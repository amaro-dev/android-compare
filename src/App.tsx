import { AppBar, Autocomplete, Card, Container, FormControl, Slider, Stack, TextField, Typography } from '@mui/material';
import { useRef, useState } from 'react';
import './App.css';
import { Phone, PhoneDef, WindowSize } from './Phone';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextFields, ZoomOutMap } from '@mui/icons-material';
import phoneData from "./catalog.json";




const toPhone = (array: any[], brand: String) => array
  .filter(it => it.screens.length == 1)
  .map(it => new PhoneDef(it.name, brand, new WindowSize(parseInt(it.screens[0].width), parseInt(it.screens[0].height)), parseInt(it.screens[0].density)))

const availablePhones = Object.keys(phoneData).flatMap((key: string) => toPhone((phoneData as any)[key] as any[], key))



function App() {

  const selector = useRef()

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

  const handleAddDevice = (e: any, a: any, b: any, c: any) => {
    let item = a.item
    let newList = Array.from(new Set([...phones, item]))
    setPhones([...newList])
    console.log((selector.current))
  }

  const handleRemoveDevice = (phone: PhoneDef) => {
    let newList = phones.filter(it => it != phone)
    setPhones(newList)
  }

  const autoCompleteStyle = {
    'label.Mui-focused': {
      color: 'primary.contrastText'
    },
    '.MuiAutocomplete-inputRoot': {
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.contrastText',
        opacity: 0.5
      },
    },
    '.MuiAutocomplete-inputRoot:hover': {
      '.MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.contrastText',
        opacity: 1
      },
    },
    input: {
      color: 'primary.contrastText',
    },
    '.MuiAutocomplete-popupIndicator': {
      color: 'primary.contrastText',
    },
    label: {
      color: 'primary.contrastText',
      opacity: 0.5
    }
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ fontFamily: "Roboto" }}>
      <Stack height="100vh">
        <AppBar sx={{ px: 2 }}>
          <Stack direction="row" height="8vh" alignItems="center">
            <Typography sx={{ width: 1 / 8 }} variant="h4">Screen Match</Typography>
            <Autocomplete
              value={null}
              sx={{ ...autoCompleteStyle, width: 1 / 2 }}
              disablePortal
              clearOnBlur={true}
              blurOnSelect={true}
              options={availablePhones.map(p => ({ label: `${p.brand} - ${p.name}`, item: p }))}
              onChange={handleAddDevice}
              renderInput={(params) => (<TextField {...params} label="Select a phone..." />)}
            />
            <FormControl sx={{ width: 1 / 6, mx: 2 }}>
              <Typography id="zoom-label">Zoom</Typography>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <ZoomOutMap />
                <Slider
                  aria-labelledby="zoom-label"
                  defaultValue={zoomLevel}
                  valueLabelDisplay="auto"
                  min={10}
                  max={200}
                  onChange={handleZoom}
                />
              </Stack>
            </FormControl>
            <FormControl sx={{ width: 1 / 6, mx: 2 }}>
              <Typography id="font-scale-label">Font scale</Typography>
              <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                <TextFields />
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
        </AppBar>
        <Stack direction="row" height="92vh" sx={{ mt: '8vh', backgroundColor: 'primary.light' }}>
          <div className='SideMenu'>
            <Stack direction="column">
              {phones.map((p: PhoneDef) => (
                <Card variant="outlined" sx={{ background: "#666", my: "0.25rem" }}>
                  <Stack direction="row" sx={{ borderRadius: '0.25rem', alignItems: 'center', justifyContent: 'space-between', p: '0.25rem 0', pl: '0.5rem' }}>
                    <Typography noWrap sx={{ color: 'primary.contrastText', fontSize: '0.75rem' }}>{p.name}</Typography>
                    <DeleteIcon sx={{ color: 'primary.contrastText', height: '1rem', cursor: 'pointer' }} onClick={() => handleRemoveDevice(p)} />
                  </Stack>
                </Card>
              ))}
            </Stack>
          </div>
          <div className='Canvas'>
            {phones.map((p: PhoneDef) => (<Phone definition={p} fontScale={fontScale} zoomLevel={zoomLevel} />))}
          </div>
        </Stack>
      </Stack>
    </Container>

  );
}

export default App;
