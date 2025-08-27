# Digital Piano Prototype

A fully functional digital piano/synthesizer built with React and Web Audio API, featuring an Old Mac OS aesthetic in monochromatic orange.

## Features

### 🎹 Piano Interface
- **13 Keys**: Full octave plus one additional C note
- **Visual Feedback**: Keys change color and position when pressed
- **Responsive Design**: Works on desktop and mobile devices

### 🎛️ Synthesizer Controls
- **Waveform Selection**: Choose between Sine, Square, Sawtooth, and Triangle waves
- **Octave Control**: Adjust pitch range (octaves 2-6)
- **Volume Slider**: Control output volume (0-100%)
- **Sustain Control**: Adjust note duration (0.1-2 seconds)

### 🎨 Design Features
- **Old Mac OS Style**: Retro interface with classic monospace fonts
- **Monochromatic Orange**: Consistent orange color scheme throughout
- **3D Effects**: Drop shadows, gradients, and inset shadows for depth
- **Responsive Layout**: Adapts to different screen sizes

## How to Use

### Basic Playing
1. **Click on Keys**: Use your mouse to click on piano keys
2. **Visual Feedback**: Keys will change color and move when pressed
3. **Audio Output**: Each key produces a different musical note

### Advanced Controls
1. **Waveform**: Change the sound character using the dropdown
   - **Sine**: Smooth, pure tone
   - **Square**: Rich, buzzy sound
   - **Sawtooth**: Bright, cutting tone
   - **Triangle**: Soft, mellow sound

2. **Octave**: Adjust the pitch range
   - Lower octaves = deeper, bass sounds
   - Higher octaves = higher, treble sounds

3. **Volume**: Control the overall output level
4. **Sustain**: Adjust how long notes continue after release

## Technical Details

### Built With
- **React 18** with TypeScript
- **Web Audio API** for sound generation
- **CSS Modules** for styling
- **Responsive Design** principles

### Audio Implementation
- Uses `AudioContext` and `OscillatorNode` for sound synthesis
- Implements proper audio cleanup and memory management
- Supports multiple simultaneous notes
- Real-time parameter control

### Browser Compatibility
- Modern browsers with Web Audio API support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Setup Instructions

1. **Navigate to the prototype**:
   ```
   /app/prototypes/digital-piano/
   ```

2. **The prototype is ready to use** - no additional setup required!

3. **Access via browser**: The piano will be available at the prototype route

## Learning Opportunities

This prototype demonstrates:
- **Web Audio API** fundamentals
- **React state management** with complex audio interactions
- **CSS animations** and 3D effects
- **Responsive design** principles
- **TypeScript interfaces** for audio data structures
- **Event handling** for mouse interactions

## Customization Ideas

- Add more octaves for extended range
- Implement keyboard controls (QWERTY mapping)
- Add effects like reverb or delay
- Create preset sounds and save/load functionality
- Add recording and playback features
- Implement MIDI support for external controllers

## Troubleshooting

### No Sound
- Ensure your browser supports Web Audio API
- Check that your system volume is not muted
- Try refreshing the page to reinitialize audio context

### Performance Issues
- Close other audio applications
- Reduce the number of simultaneous notes
- Lower the sustain value for shorter notes

---

*Built for the "Prototyping with Cursor" workshop - demonstrating modern web technologies with a nostalgic design aesthetic.*
