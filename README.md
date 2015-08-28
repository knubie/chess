# Chess

## Parlett's movement notation
In his book The Oxford History of Board Games[3] David Parlett used a notation to describe fairy piece movements. The move is specified by an expression of the form m={expression}, where m stands for "move", and the expression is composed from the following elements:

- Distance (numbers, n)
	- 1 – a distance of one (i.e. to adjacent square)
	- 2 – a distance of two
	- n – any distance in the given direction
- Direction (punctuation, X)
	- * – orthogonally or diagonally (all eight possible directions)
	- + – orthogonally (four possible directions)
	- > – orthogonally forwards
	- < – orthogonally backwards
	- <> – orthogonally forwards and backwards
	- = – orthogonally sideways (used here instead of Parlett's divide symbol.)
	- >= – orthogonally forwards or sideways
	- <= – orthogonally backwards or sideways
	- X – diagonally (four possible directions)
	- X> – diagonally forwards
	- X< – diagonally backwards
- Grouping
	- / – two orthogonal moves separated by a slash denote a hippogonal move (i.e. 	- jumping like knights)
	- & – repeated movement in the same direction, such as for hippogonal riders (i	- .e. the nightrider)
	- . - then, (i.e. an aanca is 1+.nX)

###Additions to Parlett's[edit]
The following can be added to Parlett's to make it more complete:

- Conditions under which the move may occur (lowercase alphanumeric, except n)
	- d - (default) May occur at any point in the game
	- i – May only be made on the initial move (e.g. pawn's 2 moves forward)
	- c – May only be made on a capture (e.g. pawn's diagonal capture)
	- o – May not be used for a capture (e.g. pawn's forward move)
- Move type
	- (default) – Captures by landing on the piece; blocked by intermediate pieces
	- ~ – Leaper (leaps)
	- ^ – Locust (captures by leaping; implies leaper)
- Grouping (punctuation)
	- / – two orthogonal moves separated by a slash denote a hippogonal move (i.e. 	- jumping like knights); this is in Parlett's, but is repeated here for 	- completeness
	- , (comma) – separates move options; only one of the comma-delimited options 	- may be chosen per move
	- () – grouping operator; see nightrider
	- - – range operator

The format (not including grouping) is: <conditions> <move type> <distance> <direction> <other>

On this basis, the traditional chess moves (excluding castling and en passant capture) are:

King: 1*
Queen: n*
Bishop: nX
Rook: n+
Pawn: o1>, c1X>, oi2>
Knight: ~1/2
