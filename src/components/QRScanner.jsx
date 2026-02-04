import { useRef, useEffect } from 'react';

const QRScanner = ({ 
    showQRScanner, 
    isMobile, 
    cameraError, 
    isCameraActive, 
    qrCodeInput, 
    onStopQRScan, 
    onSimulateQRDetection, 
    onManualQRSubmit, 
    onQrCodeInputChange,
    streamRef,
    onRetryCamera,
    videoRef 
}) => {
    useEffect(() => {
        if (showQRScanner && isMobile && streamRef?.current && videoRef?.current) {
        console.log('Setting video srcObject from streamRef');
        videoRef.current.srcObject = streamRef.current;
        
        // Asegúrate de que el video empiece a reproducir
        videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            });
        };
        }
    }, [showQRScanner, isMobile, streamRef, videoRef]);

    if (!showQRScanner || !isMobile) return null;

    return (
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Lector de Código QR</h3>
            <button
            onClick={onStopQRScan}
            className="text-gray-500 hover:text-gray-700 text-xl"
            >
            ✕
            </button>
        </div>
        
        <div className="relative">
            {/* Vista de la cámara */}
            <div className="border-2 border-blue-500 rounded-lg overflow-hidden mb-4 bg-black relative h-64">
            {cameraError ? (
                <div className="h-full flex flex-col items-center justify-center text-white p-4">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="font-medium mb-2 text-center">{cameraError}</p>
                <button
                    onClick={onRetryCamera}
                    className="mt-2 px-4 py-2 bg-blue-600 rounded-lg text-sm"
                >
                    Reintentar
                </button>
                </div>
            ) : (
                <div className="relative h-full">
                {/* Asegúrate de que el videoRef se pase aquí */}
                <video
                    ref={videoRef} 
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    onError={(e) => {
                    console.error('Video error:', e);
                    }}
                    style={{ transform: 'rotateY(180deg)' }} 
                />
                {/* Overlay para guía de QR */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-green-500 border-dashed rounded-lg opacity-70"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-center text-sm">
                    Apunta el código QR al cuadro verde
                </div>
                {!isCameraActive && !cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                        <div className="text-4xl mb-2 animate-pulse">📱</div>
                        <p className="font-medium">Iniciando cámara...</p>
                    </div>
                    </div>
                )}
                </div>
            )}
            </div>
            
            {/* Botón para simular detección (solo demo) */}
            <div className="mb-4">
            <button
                onClick={onSimulateQRDetection}
                className="w-full py-3 bg-linear-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-md"
            >
                <span className="mr-2">🔍</span>
                Simular detección de QR (Demo)
            </button>
            <p className="text-xs text-center text-gray-500 mt-2">
                En una app real, aquí se detectaría automáticamente el código QR
            </p>
            </div>
            
            {/* Entrada manual de código QR */}
            <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">O ingresa el código manualmente:</p>
            <form onSubmit={onManualQRSubmit} className="flex">
                <input
                type="text"
                value={qrCodeInput}
                onChange={(e) => onQrCodeInputChange(e.target.value)}
                placeholder="Ej: CASUAL-3390"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                >
                Buscar
                </button>
            </form>
            <p className="text-xs text-gray-500 mt-1">
                Prueba con: CASUAL-3390, FORMAL-5018, DEPORT-5021
            </p>
            </div>

            {/* Información de depuración (solo desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">
                <strong>Estado cámara:</strong> {isCameraActive ? 'Activa' : 'Inactiva'}
                </p>
                <p className="text-xs text-gray-600 mb-1">
                <strong>Stream:</strong> {streamRef?.current ? 'Conectado' : 'No conectado'}
                </p>
                <p className="text-xs text-gray-600">
                <strong>Video ref:</strong> {videoRef?.current ? 'Disponible' : 'No disponible'}
                </p>
                <p className="text-xs text-gray-600">
                <strong>Video srcObject:</strong> {videoRef?.current?.srcObject ? 'Conectado' : 'No conectado'}
                </p>
            </div>
            )}
        </div>
        </div>
    );
};

export default QRScanner;