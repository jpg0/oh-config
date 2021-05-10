const { fluent } = require('ohj');

with(fluent) {
    // Louvre buttons
    when(item('UpstairsLouvresSmall_Click').changed().to("close")).then(sendOff().toItem('UpstairsLouvresSmall'));
    when(item('UpstairsLouvresSmall_Click').changed().to("open")).then(sendOn().toItem('UpstairsLouvresSmall'));
    when(item('UpstairsLouvresLarge_Click').changed().to("close")).then(sendOff().toItem('UpstairsLouvresLarge'));
    when(item('UpstairsLouvresLarge_Click').changed().to("open")).then(sendOn().toItem('UpstairsLouvresLarge'));


    //pass louvre state on to their associated contacts
    when(item('UpstairsLouvresSmall_Opening').changed().from('OFF').to('ON')).then(postUpdate('OPEN').toItem('UpstairsLouvresSmall_Contact'));
    when(item('UpstairsLouvresSmall_Closing').changed().from('OFF').to('ON')).then(postUpdate('CLOSED').toItem('UpstairsLouvresSmall_Contact'));
    when(item('UpstairsLouvresSmall_Click').changed().to("close")).then(postUpdate('CLOSED').toItem('UpstairsLouvresSmall_Contact'));
    when(item('UpstairsLouvresLarge_Opening').changed().from('OFF').to('ON')).then(postUpdate('OPEN').toItem('UpstairsLouvresLarge_Contact'));
    when(item('UpstairsLouvresLarge_Closing').changed().from('OFF').to('ON')).then(postUpdate('CLOSED').toItem('UpstairsLouvresLarge_Contact'));
    when(item('UpstairsLouvresLarge_Click').changed().to("close")).then(postUpdate('CLOSED').toItem('UpstairsLouvresLarge_Contact'));
}

