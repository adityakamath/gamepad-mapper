import { useState, useEffect } from 'react';
import { GamepadData, GamepadButtonData, AxesDisplayData } from '../types/gamepad';
import styles from './GamepadMapper.module.css';

export const GamepadMapper = () => {
  const [gamepads, setGamepads] = useState<GamepadData[]>([]);
  const [selectedGamepad, setSelectedGamepad] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGamepadConnected = (event: GamepadEvent) => {
      console.log('Gamepad connected:', event.gamepad);
      updateGamepads();
    };

    const handleGamepadDisconnected = (event: GamepadEvent) => {
      console.log('Gamepad disconnected:', event.gamepad);
      updateGamepads();
      if (selectedGamepad === event.gamepad.index) {
        setSelectedGamepad(null);
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [selectedGamepad]);

  useEffect(() => {
    const updateGamepadStates = () => {
      updateGamepads();
      requestAnimationFrame(updateGamepadStates);
    };

    updateGamepadStates();
  }, []);

  const updateGamepads = () => {
    try {
      const pads = navigator.getGamepads();
      const gamepadData: GamepadData[] = [];

      for (const pad of pads) {
        if (pad) {
          gamepadData.push({
            id: pad.id,
            index: pad.index,
            connected: pad.connected,
            timestamp: pad.timestamp,
            mapping: pad.mapping,
            axes: Array.from(pad.axes),
            buttons: pad.buttons.map((button) => ({
              pressed: button.pressed,
              touched: button.touched,
              value: button.value,
            })),
          });
        }
      }

      setGamepads(gamepadData);
      setError(null);
    } catch (err) {
      setError('Error accessing gamepad data');
      console.error(err);
    }
  };

  const renderAxes = (axes: number[]) => {
    const axesData: AxesDisplayData[] = [
      { name: 'Left Stick X', value: axes[0] },
      { name: 'Left Stick Y', value: axes[1] },
      { name: 'Right Stick X', value: axes[2] },
      { name: 'Right Stick Y', value: axes[3] },
    ];

    return (
      <div className={styles.axesContainer}>
        <h3>Axes</h3>
        <div className={styles.axesGrid}>
          {axesData.map((axis, index) => (
            <div key={index} className={styles.axisItem}>
              <div className={styles.axisLabel}>{axis.name}</div>
              <div className={styles.axisValue}>{axis.value.toFixed(4)}</div>
              <div className={styles.axisBar}>
                <div
                  className={styles.axisBarFill}
                  style={{
                    width: `${((axis.value + 1) / 2) * 100}%`,
                    backgroundColor: axis.value === 0 ? '#666' : '#4a90e2',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderButtons = (buttons: GamepadButtonData[]) => {
    const buttonNames = [
      'A', 'B', 'X', 'Y',
      'L1', 'R1', 'L2', 'R2',
      'Select', 'Start',
      'L3', 'R3',
      'Up', 'Down', 'Left', 'Right',
      'Home'
    ];

    return (
      <div className={styles.buttonsContainer}>
        <h3>Buttons</h3>
        <div className={styles.buttonsGrid}>
          {buttons.map((button, index) => (
            <div
              key={index}
              className={`${styles.button} ${button.pressed ? styles.buttonPressed : ''}`}
            >
              <div className={styles.buttonName}>{buttonNames[index] || `Button ${index}`}</div>
              <div className={styles.buttonValue}>{button.value.toFixed(2)}</div>
              {button.touched && <div className={styles.buttonTouched}>Touched</div>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const selectedPad = gamepads.find(pad => pad.index === selectedGamepad);

  return (
    <div className={styles.container}>
      <h1>Gamepad Mapper</h1>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.gamepadSelector}>
        <label htmlFor="gamepad-select">Select Gamepad:</label>
        <select
          id="gamepad-select"
          value={selectedGamepad ?? ''}
          onChange={(e) => setSelectedGamepad(e.target.value ? Number(e.target.value) : null)}
          className={styles.select}
        >
          <option value="">Choose a gamepad...</option>
          {gamepads.map((pad) => (
            <option key={pad.index} value={pad.index}>
              {pad.id} (#{pad.index})
            </option>
          ))}
        </select>
      </div>

      {selectedPad ? (
        <div className={styles.gamepadInfo}>
          <div className={styles.header}>
            <h2>{selectedPad.id}</h2>
            <div className={styles.status}>
              <span className={`${styles.statusDot} ${selectedPad.connected ? styles.connected : ''}`} />
              {selectedPad.connected ? 'Connected' : 'Disconnected'}
            </div>
          </div>

          <div className={styles.details}>
            <div>Mapping: {selectedPad.mapping}</div>
            <div>Last Updated: {selectedPad.timestamp.toFixed(0)}ms</div>
          </div>

          {renderAxes(selectedPad.axes)}
          {renderButtons(selectedPad.buttons)}
        </div>
      ) : (
        <div className={styles.noGamepad}>
          {gamepads.length === 0
            ? 'No gamepads detected. Connect a gamepad and press any button to start.'
            : 'Select a gamepad from the dropdown to begin testing.'}
        </div>
      )}
    </div>
  );
}; 