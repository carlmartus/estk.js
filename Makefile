OUTPUT=estk.min.js
SRC=src/init.js

.PHONEY: all clean

$(OUTPUT): $(SRC)
	yui-compressor $(SRC) > $@

all: $(OUTPUT)

clean:
	$(RM) $(OUTPUT)
