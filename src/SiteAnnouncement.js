import React, { Fragment, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'

const he = require('he')

const useStyles = makeStyles((theme) => ({
  messageArea: {
    backgroundColor: '#e1e1e1',
    padding: theme.spacing(2),
    margin: '0px',
    display: 'flex',
    position: 'relative',
  },
  noMessageArea: {
    position: 'relative',
    margin: '0',
    padding: '0',
  },
  addMessageButton: {
    position: 'absolute',
    right: theme.spacing(),
    bottom: theme.spacing(),
  },
  editMessageButton: {
    position: 'absolute',
    right: theme.spacing(),
    bottom: theme.spacing(),
  },
  collapsed: {
    display: 'block',
    minWidth: '100%',
    maxHeight: '5em',
    overflow: 'hidden',
  },
  expanded: {
    minWidth: '100%',
  },
  collapseButton: {
    margin: 'auto',
    padding: theme.spacing(0.5),
  },
  buttonText: {
    color: theme.palette.common.bloomingtonGrey,
  },
  editorArea: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing(),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    border: '1px solid #666666',
  },
  cancelButton: {
    textTransform: 'none',
    margin: theme.spacing(0.5),
  },
  clearButton: {
    margin: theme.spacing(),
  },
  saveButton: {
    margin: theme.spacing(),
  },
  buttonArea: {
    alignSelf: 'flex-end',
    display: 'flex',
    verticalAlign: 'bottom',
    position: 'absolute',
    right: theme.spacing(),
    bottom: theme.spacing(),
  },
}))

const ReactSiteAnnouncement = (props) => {
  const classes = useStyles()

  const [displayEditor, setDisplayEditor] = React.useState(false)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const [isCollapsible, setIsCollapsible] = React.useState(false)
  const [editorState, setEditorState] = React.useState(false)
  const [messageExists, setMessageExists] = React.useState(false)
  const [addButtonVisible, setAddButtonVisible] = React.useState(true)
  const [editButtonVisible, setEditButtonVisible] = React.useState(true)

  useEffect(() => {
    function fetchData() {
      const data = props.data
      if (data) {
        initializePermissions()
        setUpEditor(data)
      }
    }

    fetchData()
  }, [])

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed)
  }

  const setUpEditor = (serverMessage) => {
    try {
      const message = JSON.parse(he.decode(serverMessage))
      if (message.blocks[0].text === '') {
        setMessageExists(false)
        setEditorState(EditorState.createEmpty())
        setIsCollapsible(false)
      } else {
        const contentState = convertFromRaw(message)

        const editorState = EditorState.createWithContent(contentState)
        setMessageExists(true)
        setEditorState(editorState)
        setIsCollapsible(
          document.getElementById('messageArea').clientHeight > 46
        )
      }
    } catch (e) {
      setMessageExists(false)
      setEditorState(EditorState.createEmpty())
      setIsCollapsible(false)
    }
  }

  const initializePermissions = () => {
    setIsAdmin(props.isAdminFlag)
  }

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState)
  }

  const onCancel = () => {
    if (!messageExists) {
      setEditorState(EditorState.createEmpty())
    }
    setDisplayEditor(false)
    setEditButtonVisible(true)
    setAddButtonVisible(true)
  }

  const onClear = () => {
    setEditorState(EditorState.createEmpty())
  }

  const onSave = async () => {
    const newMessage = {
      message: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    }
    props.saveMessage(newMessage)
    setDisplayEditor(false)
    if (editorState.getCurrentContent().hasText()) {
      setEditButtonVisible(true)
      setMessageExists(true)
    } else {
      setAddButtonVisible(true)
      setMessageExists(false)
    }
    setIsCollapsible(document.getElementById('messageArea').clientHeight > 120)
  }

  const handleAddButtonClick = () => {
    setAddButtonVisible(false)
    setDisplayEditor(true)
  }

  const handleEditButtonClick = () => {
    setEditButtonVisible(false)
    setDisplayEditor(true)
  }

  const readOnlyUserMessage = (
    <Fragment>
      <div className={isCollapsed ? classes.collapsed : classes.expanded}>
        <Grid id="messageArea" item xs={12} data-testid="readable-editor">
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            readOnly
            toolbarHidden
            toolbar={{
              link: { showOpenOptionOnHover: false },
            }}
          />
        </Grid>
      </div>
      {isCollapsible ? (
        <Button
          data-testid="collapse-button"
          aria-label={isCollapsed ? 'Collapse' : 'Expand'}
          onClick={toggleCollapsed}
          className={classes.collapseButton}
          startIcon={
            isCollapsed ? (
              <ExpandMore className={classes.buttonText} />
            ) : (
              <ExpandLess className={classes.buttonText} />
            )
          }
          size="small"
        >
          <p className={classes.buttonText}>
            {' '}
            {isCollapsed ? 'Show More' : 'Show Less'}{' '}
          </p>
        </Button>
      ) : null}
    </Fragment>
  )

  const writeEnabledUserMessage = (
    <div className={classes.editorArea}>
      <Grid container spacing={3}>
        <Grid item xs={12} id="messageArea">
          <Editor
            data-testid="editable-editor"
            editorState={editorState}
            toolbarClassName={classes.toolbarClassName}
            wrapperClassName={classes.wrapperClassName}
            editorClassName={classes.editorClassName}
            onEditorStateChange={onEditorStateChange}
            toolbar={{
              options: [
                'inline',
                'fontSize',
                'list',
                'colorPicker',
                'link',
                'textAlign',
              ],
              inline: { inDropdown: false },
              list: { inDropdown: false },
              link: { inDropdown: false, showOpenOptionOnHover: false },
              fontSize: { inDropdown: true },
              colorPicker: { inDropdown: true },
              textAlign: { inDropdown: false },
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <div className={classes.buttonArea}>
            <Button className={classes.cancelButton} onClick={onCancel}>
              {' '}
              Cancel{' '}
            </Button>
            <div className={classes.clearButton}>
              <Button
                variant="outlined"
                coloring="white"
                onClick={onClear}
                children="Clear"
              />
            </div>
            <div className={classes.saveButton}>
              <Button variant="contained" children="Save" onClick={onSave} />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )

  const editMessageButton = editButtonVisible ? (
    <Grid item xs={1} data-testid="edit-button">
      <Button
        className={classes.editMessageButton}
        color="primary"
        onClick={handleEditButtonClick}
      >
        Edit
      </Button>
    </Grid>
  ) : null

  const addMessageButton = addButtonVisible ? (
    <Grid item xs={1} data-testid="add-button">
      <Button
        color="primary"
        className={classes.addMessageButton}
        onClick={handleAddButtonClick}
      >
        Add Message
      </Button>
    </Grid>
  ) : null

  return (
    <div
      style={{ paddingTop: '5rem' }}
      className={
        messageExists || displayEditor
          ? classes.messageArea
          : classes.noMessageArea
      }
    >
      <Grid container spacing={1} data-testid="editable-editor">
        {displayEditor ? writeEnabledUserMessage : readOnlyUserMessage}
        {messageExists && isAdmin
          ? editMessageButton
          : null}
        {!messageExists && isAdmin
          ? addMessageButton
          : null}
      </Grid>
    </div>
  )
}

export default withStyles(makeStyles)(ReactSiteAnnouncement)
