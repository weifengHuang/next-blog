
export default class extends React.Component {
  constructor(props) {
    super(props)
    console.log('props', this.props)
    this.state = {
    }
  }

  render () {
    return (
      <div id="dialog-content">
        {
          this.props.chatRecords.map((record, index) => {
            let msg
            if (record.owner === 'mine') {
               msg = <div className='mine'>{record.content}</div>
            } else {
               msg = <div className='other'>{record.content}</div>
            }
            return <div key={index}>{msg}</div>
          })
        }
        <style jsx> {`
          #dialog-content {
            overflow: auto;
            height: 100%;
            .mine {
              display: flex;
              justify-content: flex-end;
              margin-right: 10px;
            }
            .other {
              display: flex;
              justify-content: flex-start;
              margin-left: 10px;
            }
          }
          `
        }
        </style>
      </div>
    )
  }
}
