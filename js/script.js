document.addEventListener('DOMContentLoaded', function() {

var welcome = document.getElementById('welcome');
var start = document.getElementById('start_button');
var area = document.getElementById('area');
var areaHeader = document.getElementById('areaHeader');
var areaContent = document.getElementById('areaContent');
var setButton = document.getElementById('set_figures');
var table = document.querySelector('table');
var putWhite = document.getElementById('white_figures');
var putBlack = document.getElementById('black_figures');

var idFromArray = [];
var stringId = [];
var numberId = [];

var firstPlayer = {
	name: '',
	moves: 0,
	striked: 0
};

var secondPlayer = {
	name: '',
	moves: 0,
	striked: 0
};

start.addEventListener('click', gettingStarted, false);
setButton.addEventListener('click', makingObjects, false);

var gameState = 'notStarted';
setButton.style.display = 'none'

function reset() {
	for (var i = 0; i < idFromArray; i++) {
		var element = document.getElementById(idFromArray[i]);
		console.log(element);

		if (element.firstChild) {
			element.remove(element.firstChild);
			console.log(element);
		}
	}
}

function gettingStarted() {
	area.style.display = 'none';
	namePlayers();
	gameState = 'started';
	setGameElements();
	preparingArea();
	// resetButton();
	getFieldsId();
	movingFigures();
}

// Resetowanie rozgrywki
function resetButton() {
	var reset = document.createElement('button');
	area.appendChild(reset);
	reset.setAttribute('id', 'reset_button');
	reset.innerText = 'Resetuj';
	reset.addEventListener('click', reset, false);
}

function setGameElements() {
  switch(gameState) {
    case 'started':
        welcome.style.display = 'none';
		area.style.display = 'block';
		table.style.display = 'inline-block';
		putWhite.style.display = 'inline-block';
		putBlack.style.display = 'inline-block';
		setButton.style.display = 'block';
      	break;
  }
}

// Podanie imion zawodników
function namePlayers() {
	 firstPlayer.name = prompt('Podaj imię pierwszego gracza: ');

	while (!firstPlayer.name) {
		firstPlayer.name = prompt('Podaj imię pierwszego gracza: ');
	}

	secondPlayer.name = prompt('Podaj imię drugiego gracza: ');

	while (!secondPlayer.name) {
		secondPlayer.name = prompt('Podaj imię drugiego gracza: ');
	}
}

// Tworzenie planszy do gry
function preparingArea() {
	var alphabetLetter = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
	var rowNumber = [8, 7, 6, 5, 4, 3, 2, 1];
	areaLetterHeader = '';
	areaSquares = ''; 
	var squareCounter = 1;
	// Liczba wierszy
	for (var i = 1; i < 9; i++) {

		if (i === 1) {
			areaLetterHeader += '<tr>';

			// Nagłówki A - H
			for (var k = 0; k < alphabetLetter.length; k++) {
				areaLetterHeader += '<th class="letter-header">' + alphabetLetter[k] + '</th>';
				
				if (k === alphabetLetter.length - 1) {
					areaLetterHeader += '</tr>';
				}
			}
		}

		areaSquares += '<tr id="row_' + i + '"><td class="number-aside">' + rowNumber[i-1] + '</td>'; 
		// Wstawianie czarno-białych pól na szachownicy
		for (var j = 1; j < 9; j++) {

			if (j % 2 === 0) {
				areaSquares += '<td class="white-sqr" id="square_' + squareCounter + '"</td>';
				squareCounter++;

			} else if ((j !== 1) && (j % 2 !== 0)) {
				areaSquares += '<td class="black-sqr" id="square_' + squareCounter + '"</td>';
				squareCounter++;

			} else if ((i % 2 === 0) && (j % 2 !== 0 )) {
				areaSquares += '<td class="black-sqr" id="square_' + squareCounter + '"</td>';
				squareCounter++;
			}

			if ((i % 2 !== 0) && (j === 8)) {
				areaSquares += '<td class="black-sqr" id="square_' + squareCounter + '"</td>';
				squareCounter++;
			}
		}
		areaHeader.innerHTML = areaLetterHeader;
		areaContent.innerHTML = areaSquares;
	}
}

// Tworzenie tablicy składającej się ze wszystkich id pól szachownicy (1 - 64)
function getFieldsId() {
	var allSquareId = document.querySelectorAll('*[id^="square_"]');

	allSquareId.forEach(function(el) {
		allSquareId = el.attributes[1].value; // Przechowuje pojedynczy id elementu 
		var arrayOfId = idFromArray.push(allSquareId); // zawiera pojedyncze nazwy id, nie jako tablica.
		var arrayOfSplittedId = allSquareId.split('_'); // tablica zawierająca rozdzielone id: np ["square", "12"]
		var stringNumber = arrayOfSplittedId[1]; // Liczba z id jako String: 12
		var arrayId = stringId.push(stringNumber); // Tablica zawierająca string-liczby z id: ['1', '2' . '3']
		var aloneNumber = parseInt(stringNumber);
		var arrayOfIdNumber = numberId.push(aloneNumber); // Tablica zawierająca liczby z id jako typ Number: [1, 2]
	});
}

// Zmiana pól z pustych na zajęte i na odwrót
function emptyMarkedFields() {
	var i = 0;

	for (var j = 0; j < idFromArray.length; j++) {

		if ((!document.getElementById(idFromArray[j]).firstChild) || (document.getElementById(idFromArray[j]).lastChild.style.display === 'none')) {
			document.getElementById(idFromArray[j]).classList.add('empty');
			document.getElementById(idFromArray[j]).classList.remove('marked');

		} else if (document.getElementById(idFromArray[j]).firstChild) {
			document.getElementById(idFromArray[j]).classList.add('marked');
			document.getElementById(idFromArray[j]).classList.remove('empty');
		}

		i++;
	}
}

// Konstruktor tworzący obiekty figur
function Figure(color, type, id, image) {
	this.color = color;
	this.type = type;
	this.id = id;
	this.image = image;
}

function makingObjects() {
	// setButton.innerText = 'Zacznij od nowa';
	var figureType = ['Rook_1', 'Knight_1', 'Bishop_1', 'Queen', 'King', 'Bishop_2', 'Knight_2', 'Rook_2', 'Pawn'];
	var figureColor = ['black', 'white'];
	var figureArray = [];
	var blackFigure;
	var whiteFigure;

	// Pętla tworząca obiekty czarnych i białych figur
	for (var i = 1; i < 2; i++) {

		for (var j = 1; j < 33; j++) {
			// Pierwszy rząd czarnych figur
			if (j < 9) {
				blackFigure = new Figure(figureColor[0], figureType[j-1], j, '<img src = img/' + j + '.svg id="black_' + figureType[j-1] + '" class=' + figureColor[0] + '>');
				figureArray.push(blackFigure);
				var image = document.createElement('img');
				image.src = 'img/' + j + '.svg';
				image.id = 'black_' + figureType[j-1];
				image.className = figureColor[0];
				var wholeImage = document.getElementById('square_' + j).appendChild(image);
				
			// Drugi rząd czarnych pionów
			} else if ((j >= 9) && (j < 17)) {
				blackFigure = new Figure(figureColor[0], figureType[8], j, '<img src = img/9.svg id="black_' + figureType[8] + '_' + (j - 8) + '" class=' + figureColor[0] + '>');
				figureArray.push(blackFigure);
				var image = document.createElement('img');
				image.src = 'img/9.svg';
				image.id = 'black_' + figureType[8] + '_' + (j - 8);
				image.className = figureColor[0];
				var wholeImage = document.getElementById('square_' + j).appendChild(image);
			
			// Pierwszy rząd białych pionów
			} else if ((j >= 17) && (j < 25)) {
				whiteFigure = new Figure(figureColor[1], figureType[8], j, '<img src = img/10.svg id="white_' + figureType[8] + '_' + (j - 16) + '" class=' + figureColor[1] + '>');
				figureArray.push(whiteFigure);
				var image = document.createElement('img');
				image.src = 'img/10.svg';
				image.id = 'white_' + figureType[8] + '_' + (j - 16);
				image.className = figureColor[1];
				var wholeImage = document.getElementById('square_' + (j + 32)).appendChild(image);
			
			// Drugi rząd białych pionów
			} else {
				whiteFigure = new Figure(figureColor[1], figureType[j - 25], j, '<img src = img/' + (j - 14) + '.svg id="white_' + figureType[j - 25] + '" class=' + figureColor[1] + '>');
				figureArray.push(whiteFigure);
				var image = document.createElement('img');
				image.src = 'img/' + (j - 14) + '.svg';
				image.id = 'white_' + figureType[j - 25];
				image.className = figureColor[1];
				var wholeImage = document.getElementById('square_' + (j + 32)).appendChild(image);
			}
		}
	}
	emptyMarkedFields();
	removeAttributes();

	// Przypisanie EventListenera do każdego zdjęcia
	var figure = document.querySelectorAll('img');

	for (var i = 0 ; i < figure.length; i++) {
	   figure[i].addEventListener('mousedown' , getAttributes , false ); 
	   figure[i].addEventListener('mouseup' , removeColors , false ); 
	}
}


function removeAttributes() {
	for (var i = 0; i < idFromArray.length; i++ ) {
		document.getElementById(idFromArray[i]).removeAttribute('<');
		document.getElementById(idFromArray[i]).removeAttribute('td');
	}
}

// Funkcja odpowiedzialna za przesuwanie figur po planszy
function movingFigures() {
	document.addEventListener("dragstart", function(event) {
	    event.dataTransfer.setData("Text", event.target.id);
	}, false);

	/* Events fired on the drop target */
	document.addEventListener("dragover", function(event) {
	    event.preventDefault();

	}, false);

	document.addEventListener("drop", function(event) {
	    event.preventDefault();
	    var data = event.dataTransfer.getData("Text");
	    event.target.appendChild(document.getElementById(data));;
	    emptyMarkedFields();
	    strikeFigures();
	    removeColors();

	}, false);
}

// Zbijanie figur (nie można usunąć, więc trzeba było kombinować)
function strikeFigures() {
	var strikedFigure;
	for (var i = 0; i < idFromArray.length; i++) {
		var element = document.getElementById(idFromArray[i]);

		if (element.hasChildNodes()) {
			if (element.firstChild.firstChild) {
				var dragged = element.firstChild.firstChild;
				element.prepend(dragged);
				var child = element.firstChild;
				var childId = element.firstChild.id;
				strikedFigure = element.lastChild;
				strikedFigure.style.display = 'none';
				strikedFigure.className = 'striked';

				if (!element.firstChild.firstChild) {
					element.classList.remove('empty');
					element.classList.add('marked');
				}
			}
		}
	}
}

// Usuwanie podświetlenia pól
function removeColors() {
	for (var i = 0; i < idFromArray.length; i++) {
		var element = document.getElementById(idFromArray[i]);
		var elementColor = element.classList[2];

		if (elementColor) {
			element.classList.remove('yellow-sqr');
			element.classList.remove('red-sqr');
		}
	}

	reset();
}

function getAttributes(e) {
	var idOfThisElement = e.target.id;

	var clickedFigureImg = document.getElementById(idOfThisElement);
	var tdElement = clickedFigureImg.parentNode;
	var tdElementId = clickedFigureImg.parentNode.id;
	var tdFieldColor = tdElement.classList[0].split('-')[0];
	var trElement = clickedFigureImg.parentNode.parentNode;
	var trId = trElement.id;
	var trNumber = parseInt(trId.split('_')[1]);
	var grandChilds = trElement.children[0];
	var fieldClass = grandChilds.classList[1];
	var grandChildsId = grandChilds.id;
	var grandChildsNumberId = parseInt(grandChildsId.split('_')[1]);
	var figureIdNumber = parseInt(tdElementId.split('_')[1]);
	var aroundNumber;
	var figureColor = clickedFigureImg.className;
	var nearFieldId;
	var arrayOfNearFields = [];
	var arrayOfRows = [];
	for (var i = 1; i < 9; i++) {
		var tr = 'row_' + i;
		arrayOfRows.push(tr);
	}
	movingFigures();

	// W zależności od koloru figury obieramy inną drogę
	if (figureColor === 'white') {
		var thisFigureId = clickedFigureImg.id;
		var figureName = thisFigureId.split('_')[1].toLowerCase();

		switch (figureName) {
			case 'pawn':

				// Sprawdzam, czy pion nie stoi przy górnej krawędzi szachownicy
				if ((figureIdNumber >= 1) && (figureIdNumber <= 8)) {
					clickedFigureImg.style.cursor = 'not-allowed';

				// Sprawdzam, ćzy pion stoi przy lewej krawędzi szachownicy
				} else if (tdElement.previousSibling.innerText) {

					for (var i = -8; i < -6; i++) {
						aroundNumber = figureIdNumber + (i);
						nearFieldId = 'square_' + aroundNumber;
						arrayOfNearFields.push(nearFieldId);
					}

					for (var i = 0; i < arrayOfNearFields.length; i++) {
						var field = document.getElementById(arrayOfNearFields[i]);
						var fieldClass = field.classList[1];
						var fieldChild = field.firstChild;

						if ((fieldClass === 'empty') && (arrayOfNearFields[i] === 'square_' + (figureIdNumber - 8))) {
							field.classList.add('yellow-sqr');
							
						} else if (fieldChild) {
							if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber - 7)) && (fieldChild.className === 'black')) {
								field.classList.add('red-sqr');
							}
						} 
					}

				// Sprawdzam, zzy pion znajduje się przy prawej krawędzi
				} else if (!tdElement.nextSibling) {

					for (var i = -9; i < -7; i++) {
						aroundNumber = figureIdNumber + (i);
						nearFieldId = 'square_' + aroundNumber;
						arrayOfNearFields.push(nearFieldId);
					}

					for (var i = 0; i < arrayOfNearFields.length; i++) {
						var field = document.getElementById(arrayOfNearFields[i]);
						var fieldClass = field.classList[1];
						var fieldChild = field.firstChild;

							if ((fieldClass === 'empty') && (arrayOfNearFields[i] === 'square_' + (figureIdNumber - 8))) {
								field.classList.add('yellow-sqr');
							
							} else if (fieldChild) {
								if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber - 9)) && (fieldChild.className === 'black')) {
									console.log("Was zbijam! :D");
									field.classList.add('red-sqr');
								}
							} 
						}

					} else {

						for (var i = -9; i < -6; i++) {
							aroundNumber = figureIdNumber + (i);
							nearFieldId = 'square_' + aroundNumber;
							arrayOfNearFields.push(nearFieldId);
						}

						for (var i = 0; i < arrayOfNearFields.length; i++) {
							var field = document.getElementById(arrayOfNearFields[i]);
							var fieldClass = field.classList[1];
							var fieldChild = field.firstChild;

							if ((fieldClass === 'empty') && (arrayOfNearFields[i] === 'square_' + (figureIdNumber - 8))) {
								field.classList.add('yellow-sqr');
							
							} else if (fieldChild) {
								if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber - 9)) && (fieldChild.className === 'black')) {
									field.classList.add('red-sqr');

								} else if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber - 7)) && (fieldChild.className === 'black')) {
									field.classList.add('red-sqr');
									
								}
							} 
						}
					}

				break;

			case 'rook':
				// Pętla dla rzędu
				for (var i = 1; i < 9; i++) {
					grandChilds = trElement.children[i];
					fieldClass = grandChilds.classList[1];
					var rowsId = grandChilds.id;
					var rowsNumberId = parseInt(rowsId.split('_')[1]);
					arrayOfNearFields.push(rowsNumberId);
				}

				for (var i = 0; i < 8; i++) {
					arrayOfRows[i];

					if ((arrayOfRows[i] === trId) && (i !== 0)) { // Jeżeli figura nie stoi na szczycie szachownicy, a przynajmniej pole niżej
							
						// Idziemy w górę kolumny
						var upCounter = 1;
						for (var j = i; j >= 0; j--) {
							var upperTd = document.getElementById('square_' + (figureIdNumber - (8 * upCounter)));

							if (upperTd) {
								var upperTdClass = upperTd.classList[1];
								if (upperTdClass === 'empty') {
									upperTd.classList.add('yellow-sqr');

								}

								if (upperTd.firstChild) {
									if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'black')) {
										upperTd.classList.add('red-sqr');
										break;
											
									} else if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'white')) {
										break;
									}
								}
							}
							upCounter++;
						}
					} 

					if((arrayOfRows[i] === trId) && (i !== 7)) {
						
						// Idziemy w dół
						var downCounter = 1;
						for (var j = i; j <= 8; j++) {
							var lowerTd = document.getElementById('square_' + (figureIdNumber + (8 * downCounter)));

							if (lowerTd) {
								var lowerTdClass = lowerTd.classList[1];

								if (lowerTdClass === 'empty') {
									lowerTd.classList.add('yellow-sqr');

								}

								if (lowerTd.firstChild) {
									if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'black')) {
										lowerTd.classList.add('red-sqr');
										break;
											
									} else if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'white')) {
										break;
									}
								}
							}
							downCounter++;
						}
					}
				}

				var numberOfFirstEl = arrayOfNearFields[0];
				var numberOfLastEl = arrayOfNearFields[7];

				// Sprawdzamy lewą stronę figury
				var leftCounter = 1;
				for (var i = figureIdNumber; i > numberOfFirstEl; i-- ) {

					var leftSibling = document.getElementById('square_' + (figureIdNumber - leftCounter));

					if (leftSibling) {
						var emptyMarkedFields = leftSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							leftSibling.classList.add('yellow-sqr');
						}

						if (leftSibling.firstChild) {
							var colorSibling = leftSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'black')) {
								leftSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'white'))) {
									break;
							}
						}

						leftCounter++;
					}
				}

				// Sprawdzamy prawą stronę figury
				var rightCounter = 1
				for (var i = figureIdNumber; i < numberOfLastEl; i++ ) {
					var rightSibling = document.getElementById('square_' + (figureIdNumber + rightCounter));

					if (rightSibling) {
						var emptyMarkedFields = rightSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							rightSibling.classList.add('yellow-sqr');
						}

						if (rightSibling.firstChild) {
							var colorSibling = rightSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'black')) {
								rightSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'white'))) {
								break;
							}
						}
					}
					rightCounter++;
				}

				break;

			case 'knight':
 				// Element po lewej stronie konika
				var leftMain = tdElement.previousSibling;

				// Szukamy lewych narożników (1 i 2)
				if((leftMain) && (!leftMain.innerText)) {
					var leftMainId = leftMain.id
					var leftMainNumber = parseInt(leftMainId.split('_')[1]);

					// Element wyżej (nr 1)
					var element1 = document.getElementById('square_' + (leftMainNumber - 8));

					if (element1) {
						var element1Number = parseInt(element1.id.split('_')[1]);

						// Jeżeli mam brata po lewej stronie i nie zawiera on tekstu
						if ((element1.previousSibling) && (!element1.previousSibling.innerText)) {
							var element1Left = element1.previousSibling;
							var element1LeftId = element1Left.id;
							var element1LeftClass = element1Left.classList[1];
							var element1LeftChild = element1Left.firstChild;

							if (element1LeftClass === 'empty') {
								element1Left.classList.add('yellow-sqr');

							}

							if (element1Left.firstChild) {
								var element1LeftChild = element1Left.firstChild;

								if ((element1LeftClass === 'marked') && (element1LeftChild.className === 'black')) {
									element1Left.classList.add('red-sqr');
								}
							}
						
						}
						
						// Jeżeli mam kogoś nad sobą
						var upperElement = document.getElementById('square_' + (element1Number - 8));

						if (upperElement) {
							var upperClass = upperElement.classList[1];

							if (upperClass === 'empty') {
								upperElement.classList.add('yellow-sqr');
							} 

							if (upperElement.firstChild) {
								var upperElementChild = upperElement.firstChild;

								if ((upperClass === 'marked') && (upperElementChild.className === 'black')) {
									upperElement.classList.add('red-sqr');
								}
							}
						}
					}

					// Element niżej (nr 2)
					var element2 = document.getElementById('square_' + (leftMainNumber + 8));

					if (element2) {
						var element2Number = parseInt(element2.id.split('_')[1]);

						if ((element2.previousSibling) && (!element2.previousSibling.innerText)) {
							var element2Left = element2.previousSibling;
							var element2LeftId = element2Left.id;
							var element2LeftClass = element2Left.classList[1];

							if (element2LeftClass === 'empty') {
								element2Left.classList.add('yellow-sqr');

							} 

							if (element2LeftChild) {
								var element2LeftChild = element2Left.firstChild;

								if ((element2LeftClass === 'marked') && (element2LeftChild.className === 'black')) {
									element2Left.classList.add('red-sqr');
								}
							}
						} 
						
						// Jeżeli mam kogoś pod sobą
						var lowerElement = document.getElementById('square_' + (element2Number + 8));

						if (lowerElement) {
							var lowerClass = lowerElement.classList[1];

							if (lowerClass === 'empty') {
								lowerElement.classList.add('yellow-sqr');
							}

							if (lowerElement.firstChild) {
								var lowerElementChild = lowerElement.firstChild;

								if ((lowerClass === 'marked') && (lowerElementChild.className === 'black')) {
									lowerElement.classList.add('red-sqr');
								}
							}
						}
					}	
				}

				// Element po prawej stronie konika
				var rightMain = tdElement.nextSibling;

				// Szukamy lewych narożników (3 i 4)
				if (rightMain) {
					var rightMainId = rightMain.id
					var rightMainNumber = parseInt(rightMainId.split('_')[1]);

					// Element wyżej (nr 3)
					var element3 = document.getElementById('square_' + (rightMainNumber - 8));

					if (element3) {
						var element3Number = parseInt(element3.id.split('_')[1]);

						// Jeżeli mam brata po prawej stronie
						if (element3.nextSibling) {
							var element3Right = element3.nextSibling;
							var element3RightId = element3Right.id;
							var element3RightClass = element3Right.classList[1];

							if (element3RightClass === 'empty') {
								element3Right.classList.add('yellow-sqr');
							} 

							if (element3Right.firstChild) {
								var element3RightChild = element3Right.firstChild;

								if ((element3RightClass === 'marked') && (element3RightChild.className === 'black')) {
									element3Right.classList.add('red-sqr');
								}
							}
							
						} 

						// Jeżeli mam kogoś nad sobą
						var upperElement = document.getElementById('square_' + (element3Number - 8));

						if (upperElement) {
							var upperClass = upperElement.classList[1];
							var upperElementChild = upperElement.firstChild;

							if (upperClass === 'empty') {
								upperElement.classList.add('yellow-sqr');
							}

							if (upperElement.firstChild) {
								if ((upperClass === 'marked') && (upperElementChild.className === 'black')) {
									upperElement.classList.add('red-sqr');
								}
							}
						} 
					}

					// Element niżej (nr 4)
					var element4 = document.getElementById('square_' + (rightMainNumber + 8));

					if (element4) {
						var element4Number = parseInt(element4.id.split('_')[1]);

						if (element4.nextSibling) {
							var element4Right = element4.nextSibling;
							var element4RightId = element4Right.id;
							var element4RightClass = element4Right.classList[1];
							var element4RightChild = element4Right.firstChild;

							if (element4RightClass === 'empty') {
								element4Right.classList.add('yellow-sqr');

							} else if ((element4RightClass === 'marked') && (element4RightChild.className === 'black')) {
								element4Right.classList.add('red-sqr');
							}
							
						} 
							
						// Jeżeli mam kogoś pod sobą
						var lowerElement = document.getElementById('square_' + (element4Number + 8));

						if (lowerElement) {
							var lowerClass = lowerElement.classList[1];
							var lowerElementChild = lowerElement.firstChild;

							if (lowerClass === 'empty') {
								lowerElement.classList.add('yellow-sqr');
							}

							if (lowerElementChild) {
								if ((lowerClass === 'marked') && (lowerElementChild.className === 'black')) {
									lowerElement.classList.add('red-sqr');
								}
							}
						}						
					} 	
				}
				
			
				break;

			case 'bishop':

				for (var i= 0; i < arrayOfRows.length; i++) {
					var actualRow = arrayOfRows[i];

					// Jeśli nie znajdujemy się na szczycie szachownicy
					if ((actualRow === trId) && (i !== 0)) {

						// Idziemy w  górę
						var counter = 1;
						for (var j = i; j > 0; j--) {

							// Idziemy w lewy górny róg 
							var leftUp = document.getElementById('square_' + (figureIdNumber + (-9 * counter)));

							if (leftUp) {
								var leftUpField = leftUp.classList[0].split('-')[0];
								var leftUpClass = leftUp.classList[1];
								var leftUpNr = parseInt(leftUp.id.split('_')[1]);
								var leftUpPrev = document.getElementById('square_' + (leftUpNr + 9));

								// Jeżeli istnieje pole w lewym górnym rogu o tym samym kolorze
								if (leftUpField === tdFieldColor) {

									if (leftUpClass === 'empty') { 
										leftUp.classList.add('yellow-sqr');
									} 

									if (leftUp.firstChild) {
										if (leftUp.firstChild.className === 'black') {
											leftUp.classList.add('red-sqr');
											break;

										} else if (leftUp.firstChild.className === 'white') {
											break;
										}
									}
								}
							}
							counter++;
						}

						var counter2 = 1;
						for (var j = i; j >= 0; j--) { 

							// Idziemy w prawy górny róg
							var rightUp = document.getElementById('square_' + (figureIdNumber + (-7 * counter2)));

							if (rightUp) {
								var rightUpField = rightUp.classList[0].split('-')[0];
								var rightUpClass = rightUp.classList[1];
								var rightUpNr = parseInt(rightUp.id.split('_')[1]);
								var rightUpPrev = document.getElementById('square_' + (rightUpNr + 7));

								// Jeżeli istnieje element w prawym górnym rogu 
								if (rightUpField === tdFieldColor) {

									if (rightUpClass === 'empty') {
										rightUp.classList.add('yellow-sqr');
									} 

									if (rightUp.firstChild) {
										if (rightUp.firstChild.className === 'black') {
											rightUp.classList.add('red-sqr');
											break;

										} else if (rightUp.firstChild.className === 'white') {
											break;			
										}
									}
								}
							}
							counter2++;
						}
					} 

					// Jeśli nie znajdujemy się na samym dole szachownicy
					if ((actualRow === trId) && (i !== 7)) {

						// Idziemy w  dół
						var lowerCounter = 1;
						for (var k = i; k <= 7; k++) {

							// Idziemy w lewy dolny róg
							var leftDown = document.getElementById('square_' + (figureIdNumber + (7 * lowerCounter)));

							if (leftDown) { 
								var leftDownField = leftDown.classList[0].split('-')[0];
								var leftDownClass = leftDown.classList[1];
								var leftDownNr = parseInt(leftDown.id.split('_')[1]);
								var leftDownPrev = document.getElementById('square_' + (leftDownNr - 7));

								// Jeżeli istnieje pole w lewym dolnym rogu o tym samym kolorze
								if (leftDownField === tdFieldColor) {

									if (leftDownClass === 'empty') {
										leftDown.classList.add('yellow-sqr');
									} 

									if (leftDown.firstChild) {
										if (leftDown.firstChild.className === 'black') {
											leftDown.classList.add('red-sqr');
											break;

										} else if (leftDown.firstChild.className === 'white') {
											break;				
										}
									}
								}
							}
							lowerCounter++;
						}

						var lowerCounter2 = 1;
						for (var k = i; k <= 7; k++) {

							// Idziemy w prawy dolny róg
							var rightDown = document.getElementById('square_' + (figureIdNumber + (9 * lowerCounter2)));

							if (rightDown) {
								var rightDownField = rightDown.classList[0].split('-')[0];
								var rightDownClass = rightDown.classList[1];
								var rightDownNr = parseInt(rightDown.id.split('_')[1]);
								var rightDownPrev = document.getElementById('square_' + (rightDownNr - 9));

								// Jeżeli istnieje element w prawym dolnym rogu 
								if (rightDownField === tdFieldColor) {

									if (rightDownClass === 'empty') {
										rightDown.classList.add('yellow-sqr');
									} 

									if (rightDown.firstChild) {
										if (rightDown.firstChild.className === 'black') {
											rightDown.classList.add('red-sqr');
											break;

										} else if (rightDown.firstChild.className === 'white') {
											break;			
										}
									}
								}
							}
							lowerCounter2++;
						}
					}
				}
				break;

			case 'queen':
// =================================================== Wieża ===============================================================

				// Pętla dla rzędu
				for (var i = 1; i < 9; i++) {
					grandChilds = trElement.children[i];
					fieldClass = grandChilds.classList[1];
					var rowsId = grandChilds.id;
					var rowsNumberId = parseInt(rowsId.split('_')[1]);
					arrayOfNearFields.push(rowsNumberId);
				}

				for (var i = 0; i < 8; i++) {
					arrayOfRows[i];

					if ((arrayOfRows[i] === trId) && (i !== 0)) { // Jeżeli figura nie stoi na szczycie szachownicy, a przynajmniej pole niżej
							
						// Idziemy w górę kolumny
						var upCounter = 1;
						for (var j = i; j >= 0; j--) {
							var upperTd = document.getElementById('square_' + (figureIdNumber - (8 * upCounter)));

							if (upperTd) {
								var upperTdClass = upperTd.classList[1];

								if (upperTdClass === 'empty') {
									upperTd.classList.add('yellow-sqr');
								}

								if (upperTd.firstChild) {
									if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'black')) {
										upperTd.classList.add('red-sqr');
										break;
											
									} else if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'white')) {
										break;
									}
								}
							}
							upCounter++;
						}	
					} 

					if((arrayOfRows[i] === trId) && (i !== 7)) {

						// Idziemy w dół
						var downCounter = 1;
						for (var j = i; j <= 8; j++) {
							var lowerTd = document.getElementById('square_' + (figureIdNumber + (8 * downCounter)));

							if (lowerTd) {
								var lowerTdClass = lowerTd.classList[1];

								if (lowerTdClass === 'empty') {
									lowerTd.classList.add('yellow-sqr');
								}

								if (lowerTd.firstChild) {
									if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'black')) {
										lowerTd.classList.add('red-sqr');
										break;
											
									} else if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'white')) {
										break;
									}
								}
							}
							downCounter++;
						}
					}
				}

				var numberOfFirstEl = arrayOfNearFields[0];
				var numberOfLastEl = arrayOfNearFields[7];

				// Sprawdzamy lewą stronę figury
				var leftCounter = 1;
				for (var i = figureIdNumber; i > numberOfFirstEl; i-- ) {

					var leftSibling = document.getElementById('square_' + (figureIdNumber - leftCounter));

					if (leftSibling) {
						var emptyMarkedFields = leftSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							leftSibling.classList.add('yellow-sqr');
						}

						if (leftSibling.firstChild) {
							var colorSibling = leftSibling.firstChild.classList[0];
							// console.log(colorSibling);
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'black')) {
								leftSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'white'))) {
								break;
							}
						}
					}
					leftCounter++;
				}

				// Sprawdzamy prawą stronę figury
				var rightCounter = 1
				for (var i = figureIdNumber; i < numberOfLastEl; i++ ) {

					var rightSibling = document.getElementById('square_' + (figureIdNumber + rightCounter));

					if (rightSibling) {
						var emptyMarkedFields = rightSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							rightSibling.classList.add('yellow-sqr');
						}

						if (rightSibling.firstChild) {
							var colorSibling = rightSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'black')) {
								rightSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'white'))) {
								break;
							}
						}
					}
					rightCounter++;
				}

// ==================================================== Goniec ==========================================================
				for (var i= 0; i < arrayOfRows.length; i++) {
					var actualRow = arrayOfRows[i];

					// Jeśli nie znajdujemy się na szczycie szachownicy
					if ((actualRow === trId) && (i !== 0)) {

						// Idziemy w  górę
						var counter = 1;
						for (var j = i; j > 0; j--) {

							// Idziemy w lewy górny róg 
							var leftUp = document.getElementById('square_' + (figureIdNumber + (-9 * counter)));

							if (leftUp) {
								var leftUpField = leftUp.classList[0].split('-')[0];
								var leftUpClass = leftUp.classList[1];
								var leftUpNr = parseInt(leftUp.id.split('_')[1]);
								var leftUpPrev = document.getElementById('square_' + (leftUpNr + 9));

								// Jeżeli istnieje pole w lewym górnym rogu o tym samym kolorze
								if (leftUpField === tdFieldColor) {

									if (leftUpClass === 'empty') { 
										leftUp.classList.add('yellow-sqr');
									} 

									if (leftUp.firstChild) {
										if (leftUp.firstChild.className === 'black') {
											leftUp.classList.add('red-sqr');
											break;

										} else if (leftUp.firstChild.className === 'white') {
											break;
										}
									}
								}
							}
							counter++;
						}

						var counter2 = 1;
						for (var j = i; j >= 0; j--) { 

							// Idziemy w prawy górny róg
							var rightUp = document.getElementById('square_' + (figureIdNumber + (-7 * counter2)));

							if (rightUp) {
								var rightUpField = rightUp.classList[0].split('-')[0];
								var rightUpClass = rightUp.classList[1];
								var rightUpNr = parseInt(rightUp.id.split('_')[1]);
								var rightUpPrev = document.getElementById('square_' + (rightUpNr + 7));

								// Jeżeli istnieje element w prawym górnym rogu 
								if (rightUpField === tdFieldColor) {

									if (rightUpClass === 'empty') {
										rightUp.classList.add('yellow-sqr');
									} 

									if (rightUp.firstChild) {
										if (rightUp.firstChild.className === 'black') {
											rightUp.classList.add('red-sqr');
											break;

										} else if (rightUp.firstChild.className === 'white') {
											break;				
										}
									}
								}
							}
							counter2++;
						}
					} 

					// Jeśli nie znajdujemy się na samym dole szachownicy
					if ((actualRow === trId) && (i !== 7)) {
							
						// Idziemy w  dół
						var lowerCounter = 1;
						for (var k = i; k <= 7; k++) {
							// Idziemy w lewy dolny róg
							var leftDown = document.getElementById('square_' + (figureIdNumber + (7 * lowerCounter)));

							if (leftDown) { 
								var leftDownField = leftDown.classList[0].split('-')[0];
								var leftDownClass = leftDown.classList[1];
								var leftDownNr = parseInt(leftDown.id.split('_')[1]);
								var leftDownPrev = document.getElementById('square_' + (leftDownNr - 7));

								// Jeżeli istnieje pole w lewym dolnym rogu o tym samym kolorze
								if (leftDownField === tdFieldColor) {

									if (leftDownClass === 'empty') {
										leftDown.classList.add('yellow-sqr');
									} 

									if (leftDown.firstChild) {
										if (leftDown.firstChild.className === 'black') {
											leftDown.classList.add('red-sqr');
											break;

										} else if (leftDown.firstChild.className === 'white') {
											break;				
										}
									}
								}
							}
							lowerCounter++;
						}

						var lowerCounter2 = 1;
						for (var k = i; k <= 7; k++) {

							// Idziemy w prawy dolny róg
							var rightDown = document.getElementById('square_' + (figureIdNumber + (9 * lowerCounter2)));

							if (rightDown) {
								var rightDownField = rightDown.classList[0].split('-')[0];
								var rightDownClass = rightDown.classList[1];
								var rightDownNr = parseInt(rightDown.id.split('_')[1]);
								var rightDownPrev = document.getElementById('square_' + (rightDownNr - 9));

								// Jeżeli istnieje element w prawym dolnym rogu 
								if (rightDownField === tdFieldColor) {

									if (rightDownClass === 'empty') {
										rightDown.classList.add('yellow-sqr');
									} 

									if (rightDown.firstChild) {
										if (rightDown.firstChild.className === 'black') {
											rightDown.classList.add('red-sqr');
											break;

										} else if (rightDown.firstChild.className === 'white') {
											break;				
										}
									}
								}
							}
							lowerCounter2++;
						}
					}
				}

				break;

			case 'king':
				var upperTd = document.getElementById('square_' + (figureIdNumber - 8));
				var previousElement = tdElement.previousSibling;
				var nextElement = tdElement.nextSibling;
				var lowerTd = document.getElementById('square_' + (figureIdNumber + 8));

				if (upperTd) {
					var prevUpper = upperTd.previousSibling;
					var nextUpper = upperTd.nextSibling;

					if (upperTd.classList[1] === 'empty') {
						upperTd.classList.add('yellow-sqr');

					} else if ((upperTd.classList[1] === 'marked') && (upperTd.firstChild.className === 'black')) {
						upperTd.classList.add('red-sqr');
					}

					if ((prevUpper) && (!prevUpper.innerText)) {
						if (prevUpper.classList[1] === 'empty') {
							prevUpper.classList.add('yellow-sqr');
							
						} else if ((prevUpper.classList[1] === 'marked') && (prevUpper.firstChild.className === 'black')) {
							prevUpper.classList.add('red-sqr');
						}
					}

					if (nextUpper) {
						if (nextUpper.classList[1] === 'empty') {
							nextUpper.classList.add('yellow-sqr');
						
						} else if ((nextUpper.classList[1] === 'marked') && (nextUpper.firstChild.className === 'black')) {
							nextUpper.classList.add('red-sqr');
						}
					}
				}

				if ((previousElement) && (!previousElement.innerText)) {
					if (previousElement.classList[1] === 'empty') {
						previousElement.classList.add('yellow-sqr');
							
					} else if ((previousElement.classList[1] === 'marked') && (previousElement.firstChild.className === 'black')) {
						previousElement.classList.add('red-sqr');
					}
				}

				if (nextElement) {
					if (nextElement.classList[1] === 'empty') {
						nextElement.classList.add('yellow-sqr');
						
					} else if ((nextElement.classList[1] === 'marked') && (nextElement.firstChild.className === 'black')) {
						nextElement.classList.add('red-sqr');
					}
				}
					

				if (lowerTd) {
					var prevLower = lowerTd.previousSibling;
					var nextLower = lowerTd.nextSibling;

					if (lowerTd.classList[1] === 'empty') {
						lowerTd.classList.add('yellow-sqr');

					} else if ((lowerTd.classList[1] === 'marked') && (lowerTd.firstChild.className === 'black')) {
						lowerTd.classList.add('red-sqr');
					}

					if ((prevLower) && (!prevLower.innerText)) {
						if (prevLower.classList[1] === 'empty') {
							prevLower.classList.add('yellow-sqr');
							
						} else if ((prevLower.classList[1] === 'marked') && (prevLower.firstChild.className === 'black')) {
							prevLower.classList.add('red-sqr');
						}
					}

					if (nextLower) {
						if (nextLower.classList[1] === 'empty') {
							nextLower.classList.add('yellow-sqr');
						
						} else if ((nextLower.classList[1] === 'marked') && (nextLower.firstChild.className === 'black')) {
							nextLower.classList.add('red-sqr');
						}
					}
				}
			break;
		}

// ======================================================== Czarne figury =============================================

	} else if (figureColor === 'black') {
		var thisFigureId = clickedFigureImg.id;
		var figureName = thisFigureId.split('_')[1].toLowerCase();

		switch (figureName) {
			case 'pawn':
				// Sprawdzam, czy pion nie stoi przy górnej krawędzi szachownicy
				if ((figureIdNumber >= 57) && (figureIdNumber <= 64)) {
					clickedFigureImg.style.cursor = 'not-allowed';

				// Sprawdzam, ćzy pion stoi przy lewej krawędzi szachownicy
				} else if (tdElement.previousSibling.innerText) {

					for (var i = 8; i < 10; i++) {
						aroundNumber = figureIdNumber + (i);
						nearFieldId = 'square_' + aroundNumber;
						arrayOfNearFields.push(nearFieldId);
					}

					for (var i = 0; i < arrayOfNearFields.length; i++) {
						var field = document.getElementById(arrayOfNearFields[i]);
						var fieldClass = field.classList[1];
						var fieldChild = field.firstChild;

						if ((fieldClass === 'empty') && (arrayOfNearFields[i] === 'square_' + (figureIdNumber + 8))) {
							field.classList.add('yellow-sqr');
							
						} else if (fieldChild) {
							if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber + 9)) && (fieldChild.className === 'white')) {
								field.classList.add('red-sqr');
							}
						} 
					}

				// Sprawdzam, zzy pion znajduje się przy prawej krawędzi
				} else if (!tdElement.nextSibling) {

					for (var i = 7; i < 9; i++) {
						aroundNumber = figureIdNumber + (i);
						nearFieldId = 'square_' + aroundNumber;
						arrayOfNearFields.push(nearFieldId);
					}

					for (var i = 0; i < arrayOfNearFields.length; i++) {
						var field = document.getElementById(arrayOfNearFields[i]);
						var fieldClass = field.classList[1];
						var fieldChild = field.firstChild;

						if ((fieldClass === 'empty') && (arrayOfNearFields[i] === 'square_' + (figureIdNumber + 8))) {
							field.classList.add('yellow-sqr');
							
						} else if (fieldChild) {
							if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber + 7)) && (fieldChild.className === 'white')) {
								field.classList.add('red-sqr');
							}
						} 
					}
				} else {

					for (var i = 7; i < 10; i++) {
						aroundNumber = figureIdNumber + (i);
						nearFieldId = 'square_' + aroundNumber;
						arrayOfNearFields.push(nearFieldId);
					}

					for (var i = 0; i < arrayOfNearFields.length; i++) {
						var field = document.getElementById(arrayOfNearFields[i]);
						var fieldClass = field.classList[1];
						var fieldChild = field.firstChild;

						if ((fieldClass === 'empty') && (arrayOfNearFields[i] === 'square_' + (figureIdNumber + 8))) {
							field.classList.add('yellow-sqr');
							
						} else if (fieldChild) {
							if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber + 7)) && (fieldChild.className === 'white')) {
								field.classList.add('red-sqr');

							} else if ((arrayOfNearFields[i] === 'square_' + (figureIdNumber + 9)) && (fieldChild.className === 'white')) {
								field.classList.add('red-sqr');	
							}
						} 
					}
				}
				break;

			case 'rook':
				// Pętla dla rzędu
				for (var i = 1; i < 9; i++) {
					grandChilds = trElement.children[i];
					fieldClass = grandChilds.classList[1];
					var rowsId = grandChilds.id;
					var rowsNumberId = parseInt(rowsId.split('_')[1]);
					arrayOfNearFields.push(rowsNumberId);
				}

				for (var i = 0; i < 8; i++) {
					arrayOfRows[i];

					if ((arrayOfRows[i] === trId) && (i !== 0)) { // Jeżeli figura nie stoi na szczycie szachownicy, a przynajmniej pole niżej
							
						// Idziemy w górę kolumny
						var upCounter = 1;
						for (var j = i; j >= 0; j--) {
							var upperTd = document.getElementById('square_' + (figureIdNumber - (8 * upCounter)));

							if (upperTd) {
								var upperTdClass = upperTd.classList[1];

								if (upperTdClass === 'empty') {
									upperTd.classList.add('yellow-sqr');
								}

								if (upperTd.firstChild) {
									if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'white')) {
										upperTd.classList.add('red-sqr');
										break;
											
									} else if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'black')) {
										break;
									}
								}
							}
							upCounter++;
						}	
					} 

					if((arrayOfRows[i] === trId) && (i !== 7)) {

						// Idziemy w dół
						var downCounter = 1;
						for (var j = i; j <= 8; j++) {
							var lowerTd = document.getElementById('square_' + (figureIdNumber + (8 * downCounter)));

							if (lowerTd) {
								var lowerTdClass = lowerTd.classList[1];

								if (lowerTdClass === 'empty') {
									lowerTd.classList.add('yellow-sqr');
								}

								if (lowerTd.firstChild) {
									if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'white')) {
										lowerTd.classList.add('red-sqr');
										break;
											
									} else if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'black')) {
										break;
									}
								}
							}
							downCounter++;
						}
					}
				}

				var numberOfFirstEl = arrayOfNearFields[0];
				var numberOfLastEl = arrayOfNearFields[7];

				// Sprawdzamy lewą stronę figury
				var leftCounter = 1;
				for (var i = figureIdNumber; i > numberOfFirstEl; i-- ) {

					var leftSibling = document.getElementById('square_' + (figureIdNumber - leftCounter));

					if (leftSibling) {
						var emptyMarkedFields = leftSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							leftSibling.classList.add('yellow-sqr');
						}

						if (leftSibling.firstChild) {
							var colorSibling = leftSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'white')) {
								leftSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'black'))) {
								break;
							}
						}
					}
					leftCounter++;
				}

				// Sprawdzamy prawą stronę figury
				var rightCounter = 1
				for (var i = figureIdNumber; i < numberOfLastEl; i++ ) {

					var rightSibling = document.getElementById('square_' + (figureIdNumber + rightCounter));

					if (rightSibling) {
						var emptyMarkedFields = rightSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							rightSibling.classList.add('yellow-sqr');
						}

						if (rightSibling.firstChild) {
							var colorSibling = rightSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'white')) {
								rightSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'black'))) {
								break;
							}
						}
					}
					rightCounter++;
				}
				break;

			case 'knight':
 				// Element po lewej stronie konika
				var leftMain = tdElement.previousSibling;

				// Szukamy lewych narożników (1 i 2)
				if((leftMain) && (!leftMain.innerText)) {

					var leftMainId = leftMain.id
					var leftMainNumber = parseInt(leftMainId.split('_')[1]);

					// Element wyżej (nr 1)
					var element1 = document.getElementById('square_' + (leftMainNumber - 8));

					if (element1) {
						var element1Number = parseInt(element1.id.split('_')[1]);

						// Jeżeli mam brata po lewej stronie i nie zawiera on tekstu
						if ((element1.previousSibling) && (!element1.previousSibling.innerText)) {
							var element1Left = element1.previousSibling;
							var element1LeftId = element1Left.id;
							var element1LeftClass = element1Left.classList[1];
							var element1LeftChild = element1Left.firstChild;

							if (element1LeftClass === 'empty') {
								element1Left.classList.add('yellow-sqr');
							}

							if (element1Left.firstChild) {
								var element1LeftChild = element1Left.firstChild;

								if ((element1LeftClass === 'marked') && (element1LeftChild.className === 'white')) {
									element1Left.classList.add('red-sqr');
								}
							}	
						} 

						// Jeżeli mam kogoś nad sobą
						var upperElement = document.getElementById('square_' + (element1Number - 8));

						if (upperElement) {
							var upperClass = upperElement.classList[1];

							if (upperClass === 'empty') {
								upperElement.classList.add('yellow-sqr');

							} 

							if (upperElement.firstChild) {
								var upperElementChild = upperElement.firstChild;

								if ((upperClass === 'marked') && (upperElementChild.className === 'white')) {
									upperElement.classList.add('red-sqr');
								}
							}
						}
					}

					// Element niżej (nr 2)
					var element2 = document.getElementById('square_' + (leftMainNumber + 8));

					if (element2) {
						var element2Number = parseInt(element2.id.split('_')[1]);

						if ((element2.previousSibling) && (!element2.previousSibling.innerText)) {
							var element2Left = element2.previousSibling;
							var element2LeftId = element2Left.id;
							var element2LeftClass = element2Left.classList[1];

							if (element2LeftClass === 'empty') {
								element2Left.classList.add('yellow-sqr');
							} 

							if (element2LeftChild) {
								var element2LeftChild = element2Left.firstChild;

								if ((element2LeftClass === 'marked') && (element2LeftChild.className === 'white')) {
									element2Left.classList.add('red-sqr');
								}
							}

						}

						// Jeżeli mam kogoś pod sobą
						var lowerElement = document.getElementById('square_' + (element2Number + 8));

						if (lowerElement) {
							var lowerClass = lowerElement.classList[1];

							if (lowerClass === 'empty') {
								lowerElement.classList.add('yellow-sqr');
							}

							if (lowerElement.firstChild) {
								var lowerElementChild = lowerElement.firstChild;

								if ((lowerClass === 'marked') && (lowerElementChild.className === 'white')) {
									lowerElement.classList.add('red-sqr');
								}
							}
						}
					} 	
				}

				// Element po prawej stronie konika
				var rightMain = tdElement.nextSibling;

				// Szukamy lewych narożników (3 i 4)
				if (rightMain) {
					var rightMainId = rightMain.id
					var rightMainNumber = parseInt(rightMainId.split('_')[1]);

					// Element wyżej (nr 3)
					var element3 = document.getElementById('square_' + (rightMainNumber - 8));
					if (element3) {
						var element3Number = parseInt(element3.id.split('_')[1]);

						// Jeżeli mam brata po prawej stronie
						if (element3.nextSibling) {
							var element3Right = element3.nextSibling;
							var element3RightId = element3Right.id;
							var element3RightClass = element3Right.classList[1];

							if (element3RightClass === 'empty') {
								element3Right.classList.add('yellow-sqr');

							} 

							if (element3Right.firstChild) {
								var element3RightChild = element3Right.firstChild;

								if ((element3RightClass === 'marked') && (element3RightChild.className === 'white')) {
									element3Right.classList.add('red-sqr');
								}
							}
						
						}

						// Jeżeli mam kogoś nad sobą
						var upperElement = document.getElementById('square_' + (element3Number - 8));

						if (upperElement) {
							var upperClass = upperElement.classList[1];
							var upperElementChild = upperElement.firstChild;

							if (upperClass === 'empty') {
								upperElement.classList.add('yellow-sqr');

							}

							if (upperElement.firstChild) {
								if ((upperClass === 'marked') && (upperElementChild.className === 'white')) {
									upperElement.classList.add('red-sqr');
								}
							}
						} 
					}

					// Element niżej (nr 4)
					var element4 = document.getElementById('square_' + (rightMainNumber + 8));
					if (element4) {
						var element4Number = parseInt(element4.id.split('_')[1]);

						if (element4.nextSibling) {
							var element4Right = element4.nextSibling;
							var element4RightId = element4Right.id;
							var element4RightClass = element4Right.classList[1];
							var element4RightChild = element4Right.firstChild;

							if (element4RightClass === 'empty') {
								element4Right.classList.add('yellow-sqr');

							} else if ((element4RightClass === 'marked') && (element4RightChild.className === 'white')) {
								element4Right.classList.add('red-sqr');
							}
							
						}
							
						// Jeżeli mam kogoś pod sobą
						var lowerElement = document.getElementById('square_' + (element4Number + 8));

						if (lowerElement) {
							var lowerClass = lowerElement.classList[1];
							var lowerElementChild = lowerElement.firstChild;

							if (lowerClass === 'empty') {
								lowerElement.classList.add('yellow-sqr');
							}

							if (lowerElementChild) {
								if ((lowerClass === 'marked') && (lowerElementChild.className === 'white')) {
									lowerElement.classList.add('red-sqr');
								}
							}
						}							
					} 	
				}
				break;

			case 'bishop':
				for (var i= 0; i < arrayOfRows.length; i++) {
					var actualRow = arrayOfRows[i];

					// Jeśli nie znajdujemy się na szczycie szachownicy
					if ((actualRow === trId) && (i !== 0)) {

						// Idziemy w  górę
						var counter = 1;
						for (var j = i; j > 0; j--) {

							// Idziemy w lewy górny róg 
							var leftUp = document.getElementById('square_' + (figureIdNumber + (-9 * counter)));

							if (leftUp) {
								var leftUpField = leftUp.classList[0].split('-')[0];
								var leftUpClass = leftUp.classList[1];
								var leftUpNr = parseInt(leftUp.id.split('_')[1]);
								var leftUpPrev = document.getElementById('square_' + (leftUpNr + 9));

								// Jeżeli istnieje pole w lewym górnym rogu o tym samym kolorze
								if (leftUpField === tdFieldColor) {

									if (leftUpClass === 'empty') { 
										leftUp.classList.add('yellow-sqr');
									} 

									if (leftUp.firstChild) {
										if (leftUp.firstChild.className === 'white') {
											leftUp.classList.add('red-sqr');
											break;

										} else if (leftUp.firstChild.className === 'black') {
											break;
										}
									}
								}
							}
							counter++;
						}

						var counter2 = 1;
						for (var j = i; j >= 0; j--) { 

							// Idziemy w prawy górny róg
							var rightUp = document.getElementById('square_' + (figureIdNumber + (-7 * counter2)));

							if (rightUp) {
								var rightUpField = rightUp.classList[0].split('-')[0];
								var rightUpClass = rightUp.classList[1];
								var rightUpNr = parseInt(rightUp.id.split('_')[1]);
								var rightUpPrev = document.getElementById('square_' + (rightUpNr + 7));

								// Jeżeli istnieje element w prawym górnym rogu 
								if (rightUpField === tdFieldColor) {

									if (rightUpClass === 'empty') {
										rightUp.classList.add('yellow-sqr');
									} 

									if (rightUp.firstChild) {
										if (rightUp.firstChild.className === 'white') {
											rightUp.classList.add('red-sqr');
											break;

										} else if (rightUp.firstChild.className === 'black') {
											break;								
										}
									}
								}
							}
							counter2++;
						}
					} 

					// Jeśli nie znajdujemy się na samym dole szachownicy
					if ((actualRow === trId) && (i !== 7)) {
							
						// Idziemy w  dół
						var lowerCounter = 1;
						for (var k = i; k <= 7; k++) {
				
							// Idziemy w lewy dolny róg
							var leftDown = document.getElementById('square_' + (figureIdNumber + (7 * lowerCounter)));

							if (leftDown) { 
								var leftDownField = leftDown.classList[0].split('-')[0];
								var leftDownClass = leftDown.classList[1];
								var leftDownNr = parseInt(leftDown.id.split('_')[1]);
								var leftDownPrev = document.getElementById('square_' + (leftDownNr - 7));

								// Jeżeli istnieje pole w lewym dolnym rogu o tym samym kolorze
								if (leftDownField === tdFieldColor) {

									if (leftDownClass === 'empty') {
										leftDown.classList.add('yellow-sqr');
									} 

									if (leftDown.firstChild) {
										if (leftDown.firstChild.className === 'white') {
											leftDown.classList.add('red-sqr');
											break;

										} else if (leftDown.firstChild.className === 'black') {
											break;			
										}
									}
								}
							}
							lowerCounter++;
						}

						var lowerCounter2 = 1;
						for (var k = i; k <= 7; k++) {

							// Idziemy w prawy dolny róg
							var rightDown = document.getElementById('square_' + (figureIdNumber + (9 * lowerCounter2)));
							if (rightDown) {
								var rightDownField = rightDown.classList[0].split('-')[0];
								var rightDownClass = rightDown.classList[1];
								var rightDownNr = parseInt(rightDown.id.split('_')[1]);
								var rightDownPrev = document.getElementById('square_' + (rightDownNr - 9));

								// Jeżeli istnieje element w prawym dolnym rogu 
								if (rightDownField === tdFieldColor) {

									if (rightDownClass === 'empty') {
										rightDown.classList.add('yellow-sqr');
									} 

									if (rightDown.firstChild) {
										if (rightDown.firstChild.className === 'white') {
											rightDown.classList.add('red-sqr');
											break;

										} else if (rightDown.firstChild.className === 'black') {
											break;									
										}
									}
								}
							}
							lowerCounter2++;
						}
					}
				}
				break;

			case 'queen':
// =================================================== Wieża ===============================================================

				// Pętla dla rzędu
				for (var i = 1; i < 9; i++) {
					grandChilds = trElement.children[i];
					fieldClass = grandChilds.classList[1];
					var rowsId = grandChilds.id;
					var rowsNumberId = parseInt(rowsId.split('_')[1]);
					arrayOfNearFields.push(rowsNumberId);
				}

				for (var i = 0; i < 8; i++) {
					arrayOfRows[i];

					if ((arrayOfRows[i] === trId) && (i !== 0)) { // Jeżeli figura nie stoi na szczycie szachownicy, a przynajmniej pole niżej
							
						// Idziemy w górę kolumny
						var upCounter = 1;
						for (var j = i; j >= 0; j--) {
							var upperTd = document.getElementById('square_' + (figureIdNumber - (8 * upCounter)));

							if (upperTd) {
								var upperTdClass = upperTd.classList[1];

								if (upperTdClass === 'empty') {
									upperTd.classList.add('yellow-sqr');
								}

								if (upperTd.firstChild) {
									if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'white')) {
										upperTd.classList.add('red-sqr');
										break;
											
									} else if ((upperTdClass === 'marked') && (upperTd.firstChild.className === 'black')) {
										break;
									}
								}
							}
							upCounter++;
						}
					} 

					if((arrayOfRows[i] === trId) && (i !== 7)) {

						// Idziemy w dół
						var downCounter = 1;
						for (var j = i; j <= 8; j++) {
							var lowerTd = document.getElementById('square_' + (figureIdNumber + (8 * downCounter)));

							if (lowerTd) {
								var lowerTdClass = lowerTd.classList[1];

								if (lowerTdClass === 'empty') {
									lowerTd.classList.add('yellow-sqr');
								}

								if (lowerTd.firstChild) {
									if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'white')) {
										lowerTd.classList.add('red-sqr');
										break;
											
									} else if ((lowerTdClass === 'marked') && (lowerTd.firstChild.className === 'black')) {
										break;
									}
								}
							}
							downCounter++;
						}
					}
				}

				var numberOfFirstEl = arrayOfNearFields[0];
				var numberOfLastEl = arrayOfNearFields[7];

				// Sprawdzamy lewą stronę figury
				var leftCounter = 1;
				for (var i = figureIdNumber; i > numberOfFirstEl; i-- ) {

					var leftSibling = document.getElementById('square_' + (figureIdNumber - leftCounter));

					if (leftSibling) {
						var emptyMarkedFields = leftSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							leftSibling.classList.add('yellow-sqr');
						}

						if (leftSibling.firstChild) {
							var colorSibling = leftSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'white')) {
								leftSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'black'))) {
								break;
							}
						}
					}
					leftCounter++;
				}

				// Sprawdzamy prawą stronę figury
				var rightCounter = 1
				for (var i = figureIdNumber; i < numberOfLastEl; i++ ) {

					var rightSibling = document.getElementById('square_' + (figureIdNumber + rightCounter));

					if (rightSibling) {
						var emptyMarkedFields = rightSibling.classList[1];

						if (emptyMarkedFields === 'empty') {
							rightSibling.classList.add('yellow-sqr');
						}

						if (rightSibling.firstChild) {
							var colorSibling = rightSibling.firstChild.classList[0];
								
							if ((emptyMarkedFields === 'marked') && (colorSibling === 'white')) {
								rightSibling.classList.add('red-sqr');
								break;
								
							} else if ((emptyMarkedFields === 'marked') && ((colorSibling === 'black'))) {
								break;
							}
						}
					}
					rightCounter++;
				}

// ==================================================== Goniec ==========================================================
				for (var i= 0; i < arrayOfRows.length; i++) {
					var actualRow = arrayOfRows[i];

					// Jeśli nie znajdujemy się na szczycie szachownicy
					if ((actualRow === trId) && (i !== 0)) {

						// Idziemy w  górę
						var counter = 1;
						for (var j = i; j > 0; j--) {

							// Idziemy w lewy górny róg 
							var leftUp = document.getElementById('square_' + (figureIdNumber + (-9 * counter)));

							if (leftUp) {
								var leftUpField = leftUp.classList[0].split('-')[0];
								var leftUpClass = leftUp.classList[1];
								var leftUpNr = parseInt(leftUp.id.split('_')[1]);
								var leftUpPrev = document.getElementById('square_' + (leftUpNr + 9));

								// Jeżeli istnieje pole w lewym górnym rogu o tym samym kolorze
								if (leftUpField === tdFieldColor) {

									if (leftUpClass === 'empty') { 
										leftUp.classList.add('yellow-sqr');
									} 

									if (leftUp.firstChild) {
										if (leftUp.firstChild.className === 'white') {
											leftUp.classList.add('red-sqr');
											break;

										} else if (leftUp.firstChild.className === 'black') {
											break;
										}
									}
								}
							}
							counter++;
						}

						var counter2 = 1;
						for (var j = i; j >= 0; j--) { 

							// Idziemy w prawy górny róg
							var rightUp = document.getElementById('square_' + (figureIdNumber + (-7 * counter2)));

							if (rightUp) {
								var rightUpField = rightUp.classList[0].split('-')[0];
								var rightUpClass = rightUp.classList[1];
								var rightUpNr = parseInt(rightUp.id.split('_')[1]);
								var rightUpPrev = document.getElementById('square_' + (rightUpNr + 7));

								// Jeżeli istnieje element w prawym górnym rogu 
								if (rightUpField === tdFieldColor) {

									if (rightUpClass === 'empty') {
										rightUp.classList.add('yellow-sqr');
									} 

									if (rightUp.firstChild) {
										if (rightUp.firstChild.className === 'white') {
											rightUp.classList.add('red-sqr');
											break;

										} else if (rightUp.firstChild.className === 'black') {
											break;					
										}
									}
								}
							}
							counter2++;
						}
					} 

					// Jeśli nie znajdujemy się na samym dole szachownicy
					if ((actualRow === trId) && (i !== 7)) {
						// Idziemy w  dół
						var lowerCounter = 1;
						for (var k = i; k <= 7; k++) {

							// Idziemy w lewy dolny róg
							var leftDown = document.getElementById('square_' + (figureIdNumber + (7 * lowerCounter)));

							if (leftDown) { 
								var leftDownField = leftDown.classList[0].split('-')[0];
								var leftDownClass = leftDown.classList[1];
								var leftDownNr = parseInt(leftDown.id.split('_')[1]);
								var leftDownPrev = document.getElementById('square_' + (leftDownNr - 7));

								// Jeżeli istnieje pole w lewym dolnym rogu o tym samym kolorze
								if (leftDownField === tdFieldColor) {

									if (leftDownClass === 'empty') {
										leftDown.classList.add('yellow-sqr');
									} 

									if (leftDown.firstChild) {
										if (leftDown.firstChild.className === 'white') {
											leftDown.classList.add('red-sqr');
											break;

										} else if (leftDown.firstChild.className === 'black') {
											break;
												
										}
									}
								}
							}
							lowerCounter++;
						}

						var lowerCounter2 = 1;
						for (var k = i; k <= 7; k++) {

							// Idziemy w prawy dolny róg
							var rightDown = document.getElementById('square_' + (figureIdNumber + (9 * lowerCounter2)));

							if (rightDown) {
								var rightDownField = rightDown.classList[0].split('-')[0];
								var rightDownClass = rightDown.classList[1];
								var rightDownNr = parseInt(rightDown.id.split('_')[1]);
								var rightDownPrev = document.getElementById('square_' + (rightDownNr - 9));

								// Jeżeli istnieje element w prawym dolnym rogu 
								if (rightDownField === tdFieldColor) {

									if (rightDownClass === 'empty') {
										rightDown.classList.add('yellow-sqr');
									} 

									if (rightDown.firstChild) {
										if (rightDown.firstChild.className === 'white') {
											rightDown.classList.add('red-sqr');
											break;

										} else if (rightDown.firstChild.className === 'black') {
											break;
												
										}
									}
								}
							}
							lowerCounter2++;
						}
					}
				}

				break;

			case 'king':
				var upperTd = document.getElementById('square_' + (figureIdNumber - 8));
				var previousElement = tdElement.previousSibling;
				var nextElement = tdElement.nextSibling;
				var lowerTd = document.getElementById('square_' + (figureIdNumber + 8));

				if (upperTd) {
					var prevUpper = upperTd.previousSibling;
					var nextUpper = upperTd.nextSibling;

					if (upperTd.classList[1] === 'empty') {
						upperTd.classList.add('yellow-sqr');

					} else if ((upperTd.classList[1] === 'marked') && (upperTd.firstChild.className === 'white')) {
						upperTd.classList.add('red-sqr');
					}

					if ((prevUpper) && (!prevUpper.innerText)) {
						if (prevUpper.classList[1] === 'empty') {
							prevUpper.classList.add('yellow-sqr');
							
						} else if ((prevUpper.classList[1] === 'marked') && (prevUpper.firstChild.className === 'white')) {
							prevUpper.classList.add('red-sqr');
						}
					}

					if (nextUpper) {
						if (nextUpper.classList[1] === 'empty') {
							nextUpper.classList.add('yellow-sqr');
						
						} else if ((nextUpper.classList[1] === 'marked') && (nextUpper.firstChild.className === 'white')) {
							nextUpper.classList.add('red-sqr');
						}
					}
				}

				if ((previousElement) && (!previousElement.innerText)) {
					if (previousElement.classList[1] === 'empty') {
						previousElement.classList.add('yellow-sqr');
							
					} else if ((previousElement.classList[1] === 'marked') && (previousElement.firstChild.className === 'white')) {
						previousElement.classList.add('red-sqr');
					}
				}

				if (nextElement) {
					if (nextElement.classList[1] === 'empty') {
						nextElement.classList.add('yellow-sqr');
							
					} else if ((nextElement.classList[1] === 'marked') && (nextElement.firstChild.className === 'white')) {
						nextElement.classList.add('red-sqr');
					}
				}
					
				if (lowerTd) {
					var prevLower = lowerTd.previousSibling;
					var nextLower = lowerTd.nextSibling;

					if (lowerTd.classList[1] === 'empty') {
						lowerTd.classList.add('yellow-sqr');

					} else if ((lowerTd.classList[1] === 'marked') && (lowerTd.firstChild.className === 'white')) {
						lowerTd.classList.add('red-sqr');
					}

					if ((prevLower) && (!prevLower.innerText)) {
						if (prevLower.classList[1] === 'empty') {
							prevLower.classList.add('yellow-sqr');
						
						} else if ((prevLower.classList[1] === 'marked') && (prevLower.firstChild.className === 'white')) {
							prevLower.classList.add('red-sqr');
						}
					}

					if (nextLower) {
						if (nextLower.classList[1] === 'empty') {
							nextLower.classList.add('yellow-sqr');
							
						} else if ((nextLower.classList[1] === 'marked') && (nextLower.firstChild.className === 'white')) {
							nextLower.classList.add('red-sqr');
						}
					}
				}
			break;
		}
	}
}

});