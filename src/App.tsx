import React, { useState, useRef, useEffect } from 'react'
import { Upload, Play, Pause, RotateCcw } from 'lucide-react'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setIsPlaying(true)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const restartPlayback = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onended = () => {
        restartPlayback()
      }
    }
  }, [file])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      {!file && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Kiosk Mode Player</h1>
          <label className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer">
            <input
              type="file"
              accept="video/*,.ppt,.pptx"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="inline-block mr-2" />
            Upload Video or PowerPoint
          </label>
        </div>
      )}
      {file && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {file.type.startsWith('video/') ? (
            <video
              ref={videoRef}
              src={URL.createObjectURL(file)}
              className="max-w-full max-h-[calc(100vh-100px)]"
              autoPlay
              loop
            />
          ) : (
            <iframe
              ref={iframeRef}
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                URL.createObjectURL(file)
              )}`}
              className="w-full h-[calc(100vh-100px)]"
              frameBorder="0"
            />
          )}
          <div className="mt-4 flex space-x-4">
            {file.type.startsWith('video/') && (
              <>
                <button
                  onClick={togglePlayPause}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  {isPlaying ? <Pause /> : <Play />}
                </button>
                <button
                  onClick={restartPlayback}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                  <RotateCcw />
                </button>
              </>
            )}
            <button
              onClick={toggleFullscreen}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App