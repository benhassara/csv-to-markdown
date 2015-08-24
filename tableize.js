var data = require('./strings');
var fs = require('fs');

var people = data.mvp.people;
var companies = data.mvp.companies;

var csvPeople = [];
var csvCompanies = [];

fs.readFile('./data/people.csv', 'utf8', function(err, data) {
  if (err) throw err;

  lines = data.split('\n');
  for (var i = 1; i < lines.length-1; i++) {
    csvPeople.push(new Person(lines[i].split(',')));
  }
  // console.log('csvPeople: \n');
  // console.log(csvPeople);
  // console.log(peopleColumnLengths(csvPeople));
  var maxes = peopleColumnLengths(csvPeople);
  var pTable = makeTable(csvPeople, maxes, 'people');

  console.log(pTable);
  fs.appendFile('csv-to-markdown.md', pTable + "\n", function(err){
    if (err) throw err;
    console.log('csvPeople table written to file.');
  });
});

fs.readFile('./data/companies.csv', 'utf8', function(err, data) {
  if (err) throw err;

  lines = data.split('\n');
  for (var i = 1; i < lines.length-1; i++) {
    csvCompanies.push(new Company(lines[i].split(',')));
  }
  // console.log('\ncsvCompanies: \n');
  // console.log(csvCompanies);
  // console.log(companyColumnLengths(csvCompanies));
  var maxCs = companyColumnLengths(csvCompanies);
  var cTable = makeTable(csvCompanies, maxCs, 'companies');

  console.log(cTable);
  fs.appendFile('csv-to-markdown.md', cTable, function(err){
    if (err) throw err;
    console.log('csvCompanies table written to file');
  });

});

function makeTable(objArr, maxes, id) {
  var headers = [];
  var output = '';

  if (id === 'people') {
    headers = ['First Name', 'Last Name', 'Address'];
  }
  else if (id === 'companies') {
    headers = ['Name', 'Suffix', 'Slogan', 'DUNS Number'];
  }

  // header row of table
  for (var i = 0; i < headers.length; i++) {
    if (i !== headers.length - 1) {
      output += headers[i] + '|';
    }
    else {
      output += headers[i];
    }
  }
  output += '\n';

  // separator line
  for (i = 0; i < headers.length; i++) {
    // headers[i];
    for (var h = 0; h < maxes[i]; h++) {
      output += '-';
    }
    if (i !== headers.length - 1) {
      output += '|';
    }
  }
  output += '\n';

  if (id === 'people') {
    for (i = 0; i < objArr.length; i++) {
      output += objArr[i].writeLine(maxes) + '\n';
    }
  }
  else if (id === 'companies') {
    for (i = 0; i < objArr.length; i++) {
      output += objArr[i].writeLine(maxes) + '\n';
    }
  }

  return output;

}

function peopleColumnLengths(objArr) {
  // assumes all obj's in objArr have identical structure
  var firstLength = objArr[0].firstName.length;
  var lastLength = objArr[0].lastName.length;
  var addressLength = objArr[0].address.length;

  for (var i = 1; i < objArr.length; i++) {
    if (objArr[i].firstName.length > firstLength) {
      firstLength = objArr[i].firstName.length;
    }
    if (objArr[i].lastName.length > lastLength) {
      lastLength = objArr[i].lastName.length;
    }
    if (objArr[i].address.length > addressLength) {
      addressLength = objArr[i].address.length;
    }
  }
  return [firstLength+1, lastLength+1, addressLength+1];
}

function companyColumnLengths(objArr) {
  var nameLength = objArr[0].name.length;
  var suffixLength = objArr[0].suffix.length;
  var sloganLength = objArr[0].slogan.length;
  var dunsLength = objArr[0].duns.length;

  for (var i = 1; i < objArr.length; i++) {
    if (objArr[i].name.length > nameLength) {
      nameLength = objArr[i].name.length;
    }
    if (objArr[i].suffix.length > suffixLength) {
      suffixLength = objArr[i].suffix.length;
    }
    if (objArr[i].slogan.length > sloganLength) {
      sloganLength = objArr[i].slogan.length;
    }
    if(objArr[i].duns.length > dunsLength) {
      dunsLength = objArr[i].duns.length;
    }
  }
  return [nameLength+1, suffixLength+1, sloganLength+1, dunsLength+1];
}

function Person(arr) {
  this.firstName = arr[0];
  this.lastName = arr[1];
  this.address = arr[2];
}

Person.prototype.writeLine = function(maxes) {
  // write a table row from the data in a Person obj
  output = "";
  data = [this.firstName, this.lastName, this.address];

  for (var i = 0; i < maxes.length; i++) {
    var numSpaces = maxes[i] - data[i].length;

    output += data[i];
    while (numSpaces > 0) {
      output += " ";
      numSpaces--;
    }

    if (i !== maxes.length-1) {
      output += "|";
    }
  }

  return output;
};

function Company(arr) {
  this.name = arr[0];
  this.suffix = arr[1];
  this.slogan = arr[2];
  this.duns = arr[3];
}

Company.prototype.writeLine = function(maxes) {
  // write a table row from the data in a Company obj
  output = "";
  data = [this.name, this.suffix, this.slogan, this.duns];

  for (var i = 0; i < maxes.length; i++) {
    var numSpaces = maxes[i]- data[i].length;
    output += data[i];

    while(numSpaces > 0) {
      output += " ";
      numSpaces--;
    }

    if (i !== maxes.length - 1) {
      output += "|";
    }
  }

  return output;
};
