import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [gamepads, setGamepads] = useState<(Gamepad | null)[]>([]);
  const [selectedGamepad, setSelectedGamepad] = useState<number | null>(null);

  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log("Gamepad connected:", e.gamepad);
      updateGamepads();
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log("Gamepad disconnected:", e.gamepad);
      updateGamepads();
    };

    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);

    // Initial check for gamepads
    updateGamepads();

    // Update gamepad state in animation frame
    let frameId: number;
    function updateFrame() {
      updateGamepads();
      frameId = requestAnimationFrame(updateFrame);
    }
    frameId = requestAnimationFrame(updateFrame);

    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const updateGamepads = () => {
    const pads = navigator.getGamepads();
    setGamepads(Array.from(pads));
  };

  const selectedPad = selectedGamepad !== null ? gamepads[selectedGamepad] : null;

  return (
    <div className="container">
      <header>
        <h1>Gamepad Tester</h1>
        <select 
          value={selectedGamepad ?? ''} 
          onChange={(e) => setSelectedGamepad(e.target.value ? Number(e.target.value) : null)}
          className="gamepad-select"
        >
          <option value="">Select a gamepad...</option>
          {gamepads.map((pad, index) => 
            pad && (
              <option key={index} value={index}>
                {pad.id} (#{index})
              </option>
            )
          )}
        </select>
      </header>

      <main>
        {selectedPad ? (
          <div className="gamepad-display">
            <div className="info-section">
              <h2>Gamepad Info</h2>
              <div className="info-grid">
                <div>
                  <label>ID:</label>
                  <span>{selectedPad.id}</span>
                </div>
                <div>
                  <label>Index:</label>
                  <span>{selectedPad.index}</span>
                </div>
                <div>
                  <label>Mapping:</label>
                  <span>{selectedPad.mapping}</span>
                </div>
                <div>
                  <label>Connected:</label>
                  <span>{selectedPad.connected ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            <div className="controls-section">
              <div className="axes-section">
                <h2>Axes</h2>
                <div className="axes-grid">
                  {selectedPad.axes.map((value, index) => (
                    <div key={index} className="axis-display">
                      <label>Axis {index}</label>
                      <div className="axis-bar">
                        <div 
                          className="axis-value" 
                          style={{ width: `${((value + 1) / 2) * 100}%` }}
                        />
                      </div>
                      <span>{value.toFixed(4)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="buttons-section">
                <h2>Buttons</h2>
                <div className="buttons-grid">
                  {selectedPad.buttons.map((button, index) => (
                    <div 
                      key={index} 
                      className={`button-display ${button.pressed ? 'pressed' : ''}`}
                    >
                      <div className="button-label">Button {index}</div>
                      <div className="button-value">{button.value.toFixed(2)}</div>
                      {button.touched && <div className="button-touched">Touched</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-gamepad">
            <p>No gamepad selected. Connect a gamepad and select it from the dropdown above.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App 