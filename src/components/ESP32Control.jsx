import { useState, useEffect } from 'react';
import { PowerIcon, RotateCw, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const ESP32Control = () => {
  const [esp32IP, setEsp32IP] = useState('esp32.local');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({
    led1: 'off',
    led2: 'off',
    led3: 'off',
    led4: 'off',
    led5: 'off',
    servo: 130
  });
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://${esp32IP}/status`);
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
      const data = await response.json();
      setStatus(data);
      setError('');
      setIsConnected(true);
    } catch (err) {
      setError('Error al conectar con el ESP32');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [esp32IP]);

  useEffect(() => {
    if (!isConnected) {
      const reconnectTimer = setTimeout(fetchStatus, 3000);
      return () => clearTimeout(reconnectTimer);
    }
  }, [isConnected]);

  const controlLED = async (led, state) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://${esp32IP}/LED${led}=${state}`);
      if (!response.ok) throw new Error('Error al controlar el LED');
      await fetchStatus();
    } catch (err) {
      setError('Error al controlar el LED');
    } finally {
      setIsLoading(false);
    }
  };

  const controlAllLEDs = async (state) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://${esp32IP}/ALLLEDS=${state}`);
      if (!response.ok) throw new Error('Error al controlar los LEDs');
      await fetchStatus();
    } catch (err) {
      setError('Error al controlar los LEDs');
    } finally {
      setIsLoading(false);
    }
  };

  const controlServo = async (state) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://${esp32IP}/SERVO=${state}`);
      if (!response.ok) throw new Error('Error al controlar el servo');
      await fetchStatus();
    } catch (err) {
      setError('Error al controlar el servo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Control ESP32</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              value={esp32IP}
              onChange={(e) => setEsp32IP(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="IP del ESP32"
            />
            <button
              onClick={fetchStatus}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {!isConnected && (
            <Alert variant="warning" className="mb-6">
              <AlertDescription>
                Intentando conectar con el ESP32...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Control de LEDs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((led) => (
              <div key={led} className="border rounded-lg p-4">
                <h3 className="font-medium mb-4 text-center">LED {led}</h3>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => controlLED(led, 'ON')}
                    disabled={isLoading}
                    className={`flex items-center px-4 py-2 rounded ${
                      status[`led${led}`] === 'on'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <PowerIcon className="w-4 h-4 mr-2" />
                    ON
                  </button>
                  <button
                    onClick={() => controlLED(led, 'OFF')}
                    disabled={isLoading}
                    className={`flex items-center px-4 py-2 rounded ${
                      status[`led${led}`] === 'off'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    <PowerIcon className="w-4 h-4 mr-2" />
                    OFF
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => controlAllLEDs('ON')}
              disabled={isLoading}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Encender Todos
            </button>
            <button
              onClick={() => controlAllLEDs('OFF')}
              disabled={isLoading}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
            >
              Apagar Todos
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Control del Servo</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => controlServo('OPEN')}
              disabled={isLoading}
              className="flex items-center bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Abrir Puerta
            </button>
            <button
              onClick={() => controlServo('CLOSE')}
              disabled={isLoading}
              className="flex items-center bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Cerrar Puerta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESP32Control;