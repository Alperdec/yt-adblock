import { useState, useEffect } from 'react';
import StartButton from './components/StartButton';
import StopButton from './components/StopButton';
import IUsageStatistics from './types';

const STORAGE_KEY = 'yt-adblock-data';

const notify = (message: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      chrome.tabs.sendMessage(tabs[0].id as number, {content: message});
  })
}

function App() {
  const [ isRunning, setIsRunning ] = useState<boolean>(false);
  const [ usageStats, setUsageStats ] = useState<IUsageStatistics>({
    totalCount: 0,
    sessionCount: 0
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(sender, sendResponse);
    const key = `${STORAGE_KEY}-adsBlocked`;
    if (request.action === 'set') {
      chrome.storage.session.set(request.data, function() {
        if (Object.keys(request.data)[0] === key) {
          const copy = usageStats;
          copy.sessionCount = request.data[key];
          copy.totalCount += copy.sessionCount - usageStats.sessionCount;
          setUsageStats(copy);
        }
      });
    }
  });
  

  useEffect(() => {
    // fetch usage statistics from persistent storage
    chrome.storage.local.get([`${STORAGE_KEY}-isRunning`, `${STORAGE_KEY}-adsBlocked`])
      .then((res) => {{
        setIsRunning(res[`${STORAGE_KEY}-isRunning`]);
        const copy = usageStats;
        copy.totalCount = res[`${STORAGE_KEY}-adsBlocked`];
        
        // fetch usage stats from session
        chrome.storage.session.get([`${STORAGE_KEY}-adsBlocked`])
        .then((res) => {{
          setUsageStats({ ...copy, sessionCount: res[`${STORAGE_KEY}-adsBlocked`] });
        }});
      }});
  }, []);

  const handleClick = () => {
    const message = isRunning ? 'stop' : 'start';
    setIsRunning(!isRunning);
    notify(message);
  }
  console.log(usageStats)
  return (
    <div className='font-mono flex flex-col items-center justify-between w-full h-full text-[#FDFDFF] bg-[#393D3F]'>
      <div className=' w-full'>
        <div className='flex p-4 items-center justify-between text-lg'>
          {isRunning ? 'Online' : 'Offline'}
          <div className='transition-all relative h-4 w-4'>
            <div className={`rounded-full w-full h-full bg-${isRunning ? 'emerald' : 'rose'}-400`} />
            <div className={`absolute top-0 left-0 rounded-full w-full h-full ${
              // doing this is more verbose, but needed for animation to work on first load
              isRunning ? 'bg-emerald-300 animate-ping':'bg-rose-300 animate-ping'}`
            } />
          </div>
        </div>
        <div className='flex flex-col gap-2 text-sm font-thin border-t-[1px] border-[#FDFDFF] p-4'>
          <div className='text-lg font-bold'>
            Usage Statistics
          </div>
          <div>
            Ads blocked since install: {usageStats.totalCount}
          </div>
          <div>
            Ads blocked current session: {usageStats.sessionCount}
          </div>
        </div>
      </div>
      <div className='w-full h-full flex items-center justify-center p-4'>
        {isRunning ? <StopButton onClick={handleClick} /> : <StartButton onClick={handleClick} />}
      </div>
      <div className='text-sm text-center border-t-[1px] border-[#FDFDFF] p-4'>
        Made with ☕&#44; ❤️ and utter 🤬 for advertisements
      </div>
    </div>
  )
}

export default App
