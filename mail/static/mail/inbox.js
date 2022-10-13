document.addEventListener('DOMContentLoaded', function () {
  // By default, load the inbox
  load_mailbox('inbox');
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').onsubmit = function () {
    let recipient = document.querySelector('#compose-recipients').value;
    let subject = document.querySelector('#compose-subject').value;
    let body = document.querySelector('#compose-body').value;
    console.log(recipient);
    console.log(subject);
    console.log(body);

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result
        console.log(result);
      });

    load_mailbox('sent')
    return false;
  }



});

function load_email(myemail) {
  console.log(myemail.id)
  fetch(`/emails/${myemail.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#one-email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  let body = "sender: " + myemail.sender
  body += "<br></br>"
  body += "recipients: " + myemail.recipients
  body += "<br></br>"
  body += "subject: " + myemail.subject
  body += "<br></br>"
  body += myemail.timestamp
  body += "<br></br>"
  body += myemail.body

  document.querySelector('#one-email-box').innerHTML = body;
  //document.querySelector('#delete').addEventListener('click', () => del(myemail));

  document.getElementById('archive').onclick = function() {
    archive(myemail);
  }

  document.getElementById('unread').onclick = function() {
    unread(myemail);
  }

  document.getElementById('reply').onclick = function() {
    reply(myemail);
  }

}

function reply(myemail) {
    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#one-email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
  
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = myemail.sender;

    if (myemail.subject.substring(0, 3).toLowerCase() === "re:") {
      document.querySelector('#compose-subject').value = myemail.subject;
    }
    else {
      document.querySelector('#compose-subject').value = "Re: " + myemail.subject;
    }

    //On Jan 1 2020, 12:00 AM foo@example.com wrote:
    document.querySelector('#compose-body').value = "\n\n\nOn " + myemail.timestamp + " " + myemail.sender + "wrote: \n" + myemail.body;
}

function unread(myemail) {
  console.log(myemail.id)
  fetch(`/emails/${myemail.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: false
    })
  })
  .then( () => load_mailbox('inbox'))
}

function archive(myemail) {
  if (myemail.archived === false) {
    fetch(`/emails/${myemail.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: true
      })
    })
    .then( () => load_mailbox('inbox'))
  }
  else {
    fetch(`/emails/${myemail.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        archived: false
      })
    })
    .then( () => load_mailbox('inbox'))
  }
}


function del(myemail) {
  return 0;
}

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#one-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {


  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#one-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === "inbox") {
    fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
        // Print emails
        console.log(emails);
        emails.forEach(myemail => {
          const li = document.createElement('li');
          li.innerHTML = myemail.sender + " " + myemail.subject + " " + myemail.timestamp;
          li.addEventListener('click', function () {
            console.log('This element has been clicked!')
            load_email(myemail)
          });
          if (myemail.read === true)
            li.style = "background-color:grey"
          else {
            li.style = ""
          }


          // Add new item to task list
          document.querySelector('#emails-view').append(li);
        })
      });
  }

  if (mailbox === "sent") {
    fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
        // Print emails
        console.log(emails);
        emails.forEach(myemail => {
          const li = document.createElement('li');
          li.innerHTML = myemail.sender + " " + myemail.subject + " " + myemail.timestamp;
          li.addEventListener('click', function () {
            console.log('This element has been clicked!')
            load_email(myemail)
          });

          // Add new item to task list
          document.querySelector('#emails-view').append(li);
        })
      });
  }

  if (mailbox === "archive") {
    fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {
        // Print emails
        console.log(emails);
        emails.forEach(myemail => {
          const li = document.createElement('li');
          li.innerHTML = myemail.sender + " " + myemail.subject + " " + myemail.timestamp;
          li.addEventListener('click', function () {
            console.log('This element has been clicked!')
            load_email(myemail)
          });

          // Add new item to task list
          document.querySelector('#emails-view').append(li);
        })
      });
  }

}