import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import abi from '../utils/WavePortal.json'
import MetaTags from '../components/MetaTags'

const Index = () => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [allWaves, setAllWaves] = useState([])

  const contractAddress = '0x181598C981Cd3450902510Eef41Dd987Cb24f3ed'
  const contractABI = abi.abi

  //test

  const populateWaves = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const wavePortalContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    )

    const waves = await wavePortalContract.getAllWaves()

    let wavesCleaned = []
    waves.forEach((wave) => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message,
      })
    })

    setAllWaves(wavesCleaned)
  }

  const getAllWaves = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        const waves = await wavePortalContract.getAllWaves()

        let wavesCleaned = []
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          })
        })

        setAllWaves(wavesCleaned)

        wavePortalContract.on('NewWave', (from, timestamp, message) => {
          console.log('NewWave', from, timestamp, message)

          setAllWaves((prevState) => [
            ...prevState,
            {
              address: from,
              timestamp: new Date(timestamp * 1000),
              message: message,
            },
          ])
        })
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      // Checks if we are authorized to access the user's wallet

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account: ', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        let userMsg = document.getElementById('userMsg').value

        document.getElementById('userMsg').value = ''

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        const waveTxn = await wavePortalContract.wave(userMsg, {
          gasLimit: 300000,
        })
        console.log('Mining...', waveTxn.hash)

        await waveTxn.wait()
        console.log('Mined -- ', waveTxn.hash)

        populateWaves()

        count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    populateWaves()
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="flex flex-1 w-full min-h-screen overflow-auto text-white bg-dark font-sans ">
      <MetaTags />
      <div className="max-w-xl mx-auto my-auto py-20 px-3">
        <h1 className="text-4xl font-bold text-center pb-5">🤙🏼 YEW! 🤙🏼</h1>
        <div className="text-lg leading-5 font-extralight text-center max-w-lg pb-5 mx-auto">
          My name is Ben. I love Surfing 🏄🏼‍♂️, but need a wave to surf! Connect
          your Ethereum Wallet and send me a wave 🌊 or two 🌊🌊 over the
          Blockchain!
        </div>

        <div className="pb-5">
          {!currentAccount && (
            <button
              className="border-white rounded-md border w-full py-2 text-lg font-bold"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="pb-5 space-y-2">
          <input
            type="text"
            id="userMsg"
            className="w-full text-sm bg-dark text-white border rounded-md px-2 py-1"
            placeholder="Send me a message"
          />
          <button
            onClick={wave}
            type="submit"
            className="border-white rounded-md border w-full py-2 text-lg"
          >
            🌊 SEND WAVE 🌊
          </button>
        </div>
        <div className="mx-auto w-full text-sm pb-5">Current Waves:</div>
        <div className="space-y-3">
          {allWaves.map((wave, index) => {
            return (
              <div
                key={index}
                className=" border border-white w-full py-2 px-2 text-sm font-extralight rounded-md"
              >
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>{' '}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Index
