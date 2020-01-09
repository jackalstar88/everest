/** @jsx jsx */
import { useState, Fragment, useEffect } from 'react'
import { Styled, jsx, Box } from 'theme-ui'
import { Grid } from '@theme-ui/components'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { URI_AVAILABLE } from '@web3-react/walletconnect-connector'
import { walletExists, getAddress } from '../../services/ethers'
import wallets from '../../connectors/wallets'
import { walletconnect } from '../../connectors'

import { Dialog } from '@reach/dialog'
import '@reach/dialog/styles.css'

import QRCodeData from './QRCodeData'

import Close from '../../images/close.svg'

const Modal = ({ children, showModal, closeModal }) => {
  const { account, activate } = useWeb3React()

  const [walletError, setWalletError] = useState(false)
  const [walletConnector, setWalletConnector] = useState(null)
  const [showAccountView, setShowAccountView] = useState(false)
  const [uri, setUri] = useState('')
  const [walletEnabled, setWalletEnabled] = useState(false)

  // TODO: reset the view to the main wallet selection view

  // set up uri listener for walletconnect
  useEffect(() => {
    if (walletExists()) {
      setWalletEnabled(true)
    }
    const activateWalletConnect = uri => {
      setUri(uri)
    }
    walletconnect.on(URI_AVAILABLE, activateWalletConnect)
    return () => {
      walletconnect.off(URI_AVAILABLE, activateWalletConnect)
    }
  }, [])

  const handleWalletActivation = async wallet => {
    setWalletConnector(wallet.connector)
    if (wallet.name === 'MetaMask') {
      if (walletExists()) {
        if (getAddress()) {
          // make a contract call to add a user, and update navigation (refresh the page)
        }
      } else {
        return window.open('https://metamask.io/', '_blank')
      }
    }
    activate(wallet.connector, undefined, true)
      .catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(wallet.connector)
        } else {
          console.error(`Error activating the wallet ${wallet.name}: `, error)
          setWalletError(true)
        }
      })
      .then(async () => {
        // TODO: make a call to the smart contract to add a user
        await setShowAccountView(true)
        if (wallet.connector !== walletconnect) {
          closeModal()
        }
      })
  }
  return (
    <div>
      {children}
      <Dialog
        isOpen={showModal}
        onDismiss={closeModal}
        aria-label="Connect to a wallet dialog"
        sx={{ position: 'relative', maxWidth: '400px', width: '100%' }}
      >
        <Close
          onClick={closeModal}
          sx={{
            position: 'absolute',
            right: 4,
            top: 4,
            fill: '#bebebe',
            cursor: 'pointer',
          }}
        />
        {!walletError && walletConnector === walletconnect ? (
          account && showAccountView ? (
            <Grid>
              <Styled.p>You are logged in</Styled.p>
              <Styled.p>{account}</Styled.p>
            </Grid>
          ) : (
            <QRCodeData size={240} uri={uri} />
          )
        ) : (
          <Fragment>
            <Styled.h4>Connect to a Wallet</Styled.h4>
            {Object.keys(wallets).map(key => {
              const wallet = wallets[key]
              return (
                <Grid
                  key={wallet.name}
                  columns={2}
                  gap={2}
                  sx={gridStyles}
                  onClick={() => handleWalletActivation(wallet)}
                >
                  <Box>
                    <img
                      src={`/${wallet.icon}`}
                      sx={iconStyles}
                      alt="Wallet icon"
                    />
                  </Box>
                  <Box>
                    <Styled.h6 sx={{ lineHeight: '1.5rem' }}>
                      {!walletEnabled && wallet.name === 'MetaMask'
                        ? 'Install MetaMask '
                        : wallet.name}
                    </Styled.h6>
                    <p sx={{ variant: 'text.displaySmaller' }}>
                      {wallet.description}
                    </p>
                  </Box>
                </Grid>
              )
            })}
          </Fragment>
        )}
      </Dialog>
    </div>
  )
}

const gridStyles = {
  gridTemplateColumns: 'min-content 1fr',
  alignItems: 'center',
  padding: '16px',
  border: '1px solid',
  borderColor: 'secondary',
  borderRadius: '16px',
  mt: 4,
  cursor: 'pointer',
}

const iconStyles = {
  height: '44px',
  width: '44px',
  objectFit: 'contain',
  mr: 3,
}

export default Modal
