
export default class extends React.Component {
  constructor (props) {
    super(props)
    console.log('props', this.props)
    this.state = {
    }
  }

  render () {
    return (
      <div id='dialog-content'>
        {
          this.props.chatRecords.map((record, index) => {
            let msg
            if (record.owner === 'mine') {
              msg =
                <div className='mine'>
                  <div>{record.time.toLocaleTimeString()}</div>
                  <div className='content'>{record.content}</div>
                </div>
            } else {
              msg =
                <div className='other'>
                  <div>{record.time.toLocaleTimeString()}</div>
                  <div className='content'>{record.content}</div>
                </div>
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
              // justify-content: flex-end;
              margin-right: 10px;
              flex-direction: column;
              align-items: flex-end;
              flex-wrap: wrap;
            }
            .other {
              display: flex;
              margin-left: 10px;
              flex-direction: column;
              align-items: flex-start;
            }
            .content {
              margin: 10px;
              // width: 100%;
              // display: block;
            }
          }
          `
        }
        </style>
      </div>
    )
  }
}
