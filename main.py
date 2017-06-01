import argparse

parser = argparse.ArgumentParser(description='Keynode CLI')
parser.add_argument('something', type=int, nargs='+', help='integer')

args = parser.parse_args()

print(args.accumulate(args.integers))
